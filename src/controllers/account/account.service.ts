import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AccountListDTO,
  StaffEntityDTO,
  sys_entity_types,
} from './dto/account.model';
import { getFullName } from 'src/shared/methods';
import { AccountRepository } from './account.repository';
import {
  LoginDto,
  RegisterBusinessStaffDto,
  RegisterOwnerStaffDto,
  ResetPasswordDto,
} from './dto/account.dto';
import { TranslationService } from 'src/i18n/translation.service';
import { AuthService } from './auth.service';
import { EmailSenderService } from 'src/shared/modules/email-sender/email-sender.service';
import { VerificationCodeService } from 'src/shared/modules/email-sender/verification-code.service';
import { Response } from 'express';
import { UserAuth } from 'src/entities/user-auth.entity';
import { EntityModel } from 'src/entities/entity.entity';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
    private readonly accountRepo: AccountRepository,
    private readonly translationService: TranslationService,
    private readonly authService: AuthService,
    private readonly emailSenderService: EmailSenderService,
    private readonly verificationCodeService: VerificationCodeService,
  ) {}

  async registerOwnerStaff(
    dto: RegisterOwnerStaffDto,
  ): Promise<{ id: number; token: string }> {
    const { email, first_name, last_name, password } = dto;

    const emailUsed = await this.accountRepo.checkEmailUsedForStaff(email);
    if (emailUsed) {
      throw new BadRequestException(
        this.translationService.t(
          'resources.account.exists_proceed_with_login',
        ),
      );
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const data: StaffEntityDTO = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      sys_entity_type_id: sys_entity_types.staff,
      is_guest: false,
      role_id: 0, // Will be set internally for owner
    };

    const newAccount = await this.accountRepo.registerStaff(data, false, null);

    if (!newAccount) {
      throw new UnprocessableEntityException(
        'resources.account.failed_create_account',
      );
    }
    try {
      await this.emailSenderService.sendVerificationCode(
        newAccount.id,
        data.email,
        true,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    const token = this.authService.generatePreAuthToken(newAccount.id);

    return { id: newAccount.id, token };
  }
  async resendEmailVerification(
    entity_id: number,
    checkAccountIsVerified: boolean,
  ): Promise<void> {
    const user_auth = await this.accountRepo.getById(entity_id);

    if (checkAccountIsVerified && user_auth.email_verified) {
      throw new BadRequestException('resources.account.email_verified');
    }

    try {
      await this.emailSenderService.sendVerificationCode(
        user_auth.entity_id,
        user_auth.email,
        true,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  }
  async verifyEmailCode(
    res: Response,
    entity_id: number,
    code: string,
    checkAccountIsVerified: boolean,
  ): Promise<{ verified: boolean; token: string }> {
    const user_auth = await this.accountRepo.getById(entity_id);

    if (checkAccountIsVerified && user_auth.email_verified) {
      throw new BadRequestException('resources.account.email_verified');
    }

    const verificationCode = await this.verificationCodeService.getEmailToken(
      entity_id,
      code,
    );

    if (!verificationCode) {
      throw new BadRequestException(
        'resources.account.invalid_verification_code',
      );
    }
    if (verificationCode.expires_at < new Date())
      throw new BadRequestException('resources.account.expired_code');

    this.verificationCodeService.setVerificationTokenAsUsed(verificationCode);

    if (!user_auth.email_verified) {
      user_auth.email_verified = true;
      this.accountRepo.saveUser(user_auth);
    }

    const { accessToken, refreshToken } = this.authService.generateJWTokens(
      user_auth,
      !checkAccountIsVerified,
    );
    if (!checkAccountIsVerified) {
      this.authService.addRefreshTokenCookie(res, refreshToken);
    }
    return { verified: true, token: accessToken };
  }
  async registerBusinessStaff(
    businessId: number,
    dto: RegisterBusinessStaffDto,
  ): Promise<AccountListDTO> {
    const emailUsed = await this.accountRepo.checkEmailUsedForStaff(dto.email);
    if (emailUsed) {
      throw new BadRequestException(
        this.translationService.t(
          'resources.account.exists_proceed_with_login',
        ),
      );
    }

    const hashedPassword = await this.authService.hashPassword(dto.password);

    const data: StaffEntityDTO = {
      first_name: dto.first_name,
      last_name: dto.last_name,
      email: dto.email,
      password: hashedPassword,
      sys_entity_type_id: sys_entity_types.staff,
      is_guest: false,
      role_id: dto.role_id,
    };

    const newAccount = await this.accountRepo.registerStaff(
      data,
      true,
      businessId,
    );

    if (!newAccount) {
      throw new UnprocessableEntityException(
        'resources.account.failed_create_account',
      );
    }

    if (!!newAccount.user_email) {
      try {
        await this.emailSenderService.sendAccountAddedEmail(
          newAccount.id,
          newAccount.user_email,
        );
      } catch (error) {}
    }

    const response: AccountListDTO = {
      id: newAccount.id,
      email: newAccount.user_email,
      email_verified: false,
      full_name: getFullName(newAccount.first_name, newAccount.last_name),
      first_name: newAccount.first_name,
      last_name: newAccount.last_name,
      url: newAccount.url,
      role_id: newAccount.role_id,
      role: {
        id: newAccount.role_id,
        name: newAccount.role_name,
        description: newAccount.role_description,
      },
    };

    return response;
  }
  // tested
  async updateStaff(
    staff_id: number,
    inputUserAuth: Partial<UserAuth>,
    inputEntity: Partial<EntityModel>,
    business_id: number,
    caller_id: number,
  ) {
    //TODO: validate caller and business and staff are all in the same business
    const dbUserAuth = await this.accountRepo.getById(staff_id);
    // check if updated email is used
    if (!!inputUserAuth.email && inputUserAuth.email !== dbUserAuth.email) {
      const emailUsed = await this.accountRepo.checkEmailUsedForStaff(
        inputUserAuth.email,
      );
      if (emailUsed) {
        throw new BadRequestException(
          this.translationService.t('resources.account.email_already_exists'),
        );
      }
    }

    //TODO: Future: check if business allowed to use this specific role (based on plan it has)
    const role = await this.roleRepo.findOne({
      where: { id: inputUserAuth.role_id || dbUserAuth.role_id },
    });
    if (!role || (!role.system_role && role.business_id !== business_id)) {
      throw new BadRequestException('resources.account.role_not_found');
    }
    if (
      !!inputUserAuth.role_id &&
      inputUserAuth.role_id !== dbUserAuth.role_id &&
      (role.owner_role || !role.system_role)
    ) {
      throw new BadRequestException('resources.account.role_not_allowed');
    }

    if (!!inputUserAuth.email && inputUserAuth.email !== dbUserAuth.email) {
      dbUserAuth.email_verified = false;
    }

    let passwordHasChanged = false;
    if (!!inputUserAuth.password) {
      passwordHasChanged = !(await this.authService.isCorrectPassword(
        inputUserAuth.password,
        dbUserAuth.password,
      ));
      inputUserAuth.password = await this.authService.hashPassword(
        inputUserAuth.password,
      );
    }
    Object.assign(dbUserAuth, inputUserAuth);
    dbUserAuth.updated_at = new Date();

    Object.assign(dbUserAuth.entity, inputEntity);
    this.accountRepo.saveUser(dbUserAuth);

    const response: AccountListDTO = {
      id: dbUserAuth.entity?.id,
      email: dbUserAuth.email,
      full_name: getFullName(
        dbUserAuth.entity?.first_name,
        dbUserAuth.entity?.last_name,
      ),
      first_name: dbUserAuth.entity?.first_name,
      last_name: dbUserAuth.entity?.last_name,
      email_verified: dbUserAuth.email_verified,
      url: '', // updatedAccount.staff?.url,
      role_id: dbUserAuth.role_id,
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
      },
    };

    try {
      await this.emailSenderService.sendEmailChangeAlert(
        staff_id,
        dbUserAuth.email,
        inputUserAuth.email,
        passwordHasChanged,
      );
    } catch (error) {}

    return response;
  }
  async deleteStaff(id: number, businessId: number, caller_id: number) {
    return await this.accountRepo.deleteStaff(id, businessId, caller_id);
  }
  async getAllCustomers(businessId: number) {
    return await this.accountRepo.getAllCustomers(businessId);
  }
  async getAllStaff(businessId: number) {
    return await this.accountRepo.getAllStaff(businessId);
  }
  //tested
  async getAllRoles(businessId: number) {
    return (
      await this.roleRepo
        .createQueryBuilder('role')
        .where('role.business_id = :businessId', { businessId })
        .orWhere('role.system_role = true')
        .getMany()
    ).map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
    }));
  }
  async refreshToken(res: Response, id: number, business_id: number) {
    const user_auth = await this.accountRepo.getById(id);

    if (!user_auth || user_auth.business_id !== business_id) {
      throw new BadRequestException('resources.account.not_found');
    }

    const { accessToken, refreshToken } = this.authService.generateJWTokens(
      user_auth,
      true,
    );
    this.authService.addRefreshTokenCookie(res, refreshToken);

    return {
      token: accessToken,
    };
  }
  async loginAccount(dto: LoginDto) {
    const account = await this.accountRepo.getByEmail(dto.email);

    const isCorrectPassword = await this.authService.isCorrectPassword(
      dto.password,
      account.password,
    );
    if (!isCorrectPassword) {
      throw new BadRequestException('resources.account.invalid_credentials');
    }

    try {
      this.emailSenderService.sendVerificationCode(
        account.entity_id,
        dto.email,
        false,
      );
    } catch (error) {}

    const token = this.authService.generatePreAuthToken(account.entity_id);
    return { message: 'Login successful', token };
  }
  logoutUser(res: Response) {
    this.authService.clearCookies(res);
  }

  async forgotPassword(email: string) {
    const account = await this.accountRepo.getByEmail(email, false);
    if (!account) {
      return {
        message: this.translationService.t(
          'resources.account.email_sent_if_exists',
        ),
        token: null,
      };
    }
    await this.emailSenderService.sendVerificationCode(
      account.entity_id,
      account.email,
      false,
    );
    const token = this.authService.generatePreAuthToken(account.entity_id);
    return {
      message: this.translationService.t(
        'resources.account.email_sent_if_exists',
      ),
      token,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('resources.account.password_mismatch');
    }
    const account = await this.accountRepo.getByEmail(dto.email);
    account.password = await this.authService.hashPassword(dto.newPassword);
    this.accountRepo.saveUser(account);

    return { success: true };
  }
}
