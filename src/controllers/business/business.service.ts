import { Injectable, BadRequestException } from '@nestjs/common';
import { AccountRepository } from '../account/account.repository';

import { Response } from 'express';
import { BusinessRepository } from './business.repository';
import {
  AppointmentApprovalPayloadDto,
  BusinessCreateDto,
  SupportedLanguagesPayloadDto,
} from './dto/business.dto';
import { AuthService } from '../account/auth/auth.service';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepo: BusinessRepository,
    private readonly accountRepo: AccountRepository,
    private readonly authService: AuthService,
  ) {}

  async register(
    businessDto: BusinessCreateDto,
    entity_id: number,
    res: Response,
  ) {
    if (!entity_id)
      throw new BadRequestException('resources.account.not_found');

    const existingAccount = await this.accountRepo.getById(entity_id);

    if (existingAccount.business_id) {
      throw new BadRequestException('resources.account.is_configured');
    }

    const newBiz = await this.businessRepo.addBusiness({
      ...businessDto,
      entity_id,
    });

    const updatedAccount = await this.accountRepo.getById(
      entity_id,
      newBiz.business_id,
    );

    const { accessToken, refreshToken } = this.authService.generateJWTokens(
      updatedAccount,
      true,
    );

    this.authService.addRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  async get(business_id: number) {
    return await this.businessRepo.getById(business_id);
  }

  async getSupportedLanguages(business_id: number, entity_id: number) {
    return this.businessRepo.getSupportedLanguages(business_id, entity_id);
  }

  async setSupportedLanguages(
    business_id: number,
    entity_id: number,
    dto: SupportedLanguagesPayloadDto,
  ) {
    await this.businessRepo.setSupportedLanguages(
      business_id,
      entity_id,
      dto.supported_languages,
    );
  }

  async setAppointmentApproval(
    business_id: number,
    dto: AppointmentApprovalPayloadDto,
  ) {
    await this.businessRepo.setAppointmentApproval(business_id, dto.requires);
  }
}
