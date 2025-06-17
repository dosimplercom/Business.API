import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
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
  UpdateStaffDto,
} from './dto/account.dto';
import { TranslationService } from 'src/i18n/translation.service';
import { AuthService } from './auth.service';
import { EmailSenderService } from 'src/shared/modules/email-sender/email-sender.service';
import { VerificationCodeService } from 'src/shared/modules/email-sender/verification-code.service';
import { Response } from 'express';

@Injectable()
export class AccountService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
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
    const account = await this.accountRepo.getById(entity_id);
    if (!account || !account[0]) {
      throw new BadRequestException('resources.account.not_found');
    }
    if (checkAccountIsVerified && account.email_verified) {
      throw new BadRequestException('resources.account.email_verified');
    }

    try {
      await this.emailSenderService.sendVerificationCode(
        account.entity_id,
        account.email,
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
    const account = await this.accountRepo.getById(entity_id);
    if (!account) {
      throw new BadRequestException('resources.account.not_found');
    }
    if (checkAccountIsVerified && account.email_verified) {
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

    this.verificationCodeService.setVerificationTokenAsUsed(
      verificationCode,
    );

    if (!account.email_verified) {
      this.accountRepo.updateStaffEmailVerified(entity_id);
    }

    account.refresh = !checkAccountIsVerified;
    const { accessToken, refreshToken } =
      this.authService.generateJWTokens(account);
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
  async updateStaff(
    staff_id: number,
    dto: UpdateStaffDto,
    business_id: number,
    caller_id: number,
  ) {
    //TODO: validate caller and business and staff are all in the same business

    const staffToUpdate = await this.accountRepo.getById(staff_id);
    // check if updated email is used
    if (!!dto.email && dto.email !== staffToUpdate.email) {
      const emailUsed = await this.accountRepo.checkEmailUsedForStaff(
        dto.email,
      );
      if (emailUsed) {
        throw new BadRequestException(
          this.translationService.t('resources.account.email_already_exists'),
        );
      }
    }

    //TODO: Future: check if business allowed to use this specific role (based on plan it has)
    const role = await this.accountRepo.getRoleById(
      dto.role_id || staffToUpdate.role_id,
    );
    if (!role || (!role.system_role && role.business_id !== business_id)) {
      throw new BadRequestException('resources.account.role_not_found');
    }
    if (
      !!dto.role_id &&
      staffToUpdate.rows[0].role_id !== dto.role_id &&
      (role.owner_role || !role.system_role)
    ) {
      throw new BadRequestException('resources.account.role_not_allowed');
    }

    if (!!dto.role_id && staffToUpdate.rows[0].role_id === dto.role_id) {
      dto.role_id = null;
    }
    if (!!dto.email && staffToUpdate.rows[0].email === dto.email) {
      dto.email = null;
    }

    let passwordHasChanged = true;
    if (!!dto.password) {
      passwordHasChanged = !(await this.authService.isCorrectPassword(
        dto.password,
        staffToUpdate.password,
      ));
      dto.password = await this.authService.hashPassword(dto.password);
    }

    const updatedAccount = await this.accountRepo.updateStaff(staff_id, dto); //TODO
    if (!updatedAccount) {
      throw new UnprocessableEntityException('resources.account.not_found');
    }

    const response: AccountListDTO = {
      id: updatedAccount.entity?.id,
      email: updatedAccount.user?.email,
      full_name: getFullName(
        updatedAccount.entity?.first_name,
        updatedAccount.entity?.last_name,
      ),
      first_name: updatedAccount.entity?.first_name,
      last_name: updatedAccount.entity?.last_name,
      email_verified: updatedAccount.user?.email_verified,
      url: '', // updatedAccount.staff?.url,
      role_id: updatedAccount.user?.role_id,
      role: {
        id: role.id,
        name: role.name,
        description: role.description,
      },
    };

    try {
      await this.emailSenderService.sendEmailChangeAlert(
        staff_id,
        staffToUpdate.email,
        dto.email,
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
  async getAllRoles(businessId: number) {
    return await this.accountRepo.getAllRoles(businessId);
  }
  async refreshToken(res: Response, id: number, business_id: number) {
    const account = await this.accountRepo.getById(id);
    if (!account || !account[0] || account.business_id !== business_id) {
      throw new BadRequestException('resources.account.not_found');
    }

    account.refresh = true;
    const { accessToken, refreshToken } =
      this.authService.generateJWTokens(account);
    this.authService.addRefreshTokenCookie(res, refreshToken);

    return {
      token: accessToken,
    };
  }
  async loginAccount(dto: LoginDto) {
    const account = await this.accountRepo.getByEmail(dto.email);
    if (!account) {
      throw new BadRequestException('resources.account.not_found');
    }
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
    const account = await this.accountRepo.getByEmail(email);

    if (!account) {
      return {
        message: this.translationService.t(
          'resources.account.email_sent_if_exists',
        ),
        token: null,
      };
    }
    await this.emailSenderService.sendVerificationCode(
      account.id,
      account.email,
      false,
    );
    const token = this.authService.generatePreAuthToken(account.id);
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

    if (!account) {
      throw new BadRequestException('resources.account.not_found');
    }
    dto.newPassword = await this.authService.hashPassword(dto.newPassword);
    const updatedAccount = await this.accountRepo.updateStaffPassword(
      account.id,
      dto.newPassword,
    );
    if (!updatedAccount) {
      throw new UnprocessableEntityException(
        'resources.account.failed_reset_password',
      );
    }
    return { success: true };
  }
}
