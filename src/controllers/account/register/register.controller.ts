import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { RegisterOwnerStaffDto, VerifyEmailCodeDto } from '../dto/account.dto';
import { LightAuthenticatedGuard } from 'src/shared/guards/light-auth.guard';
import { AccountService } from '../account.service';
import { Public } from 'src/shared/decorators/public.decorator';

@UseGuards(LightAuthenticatedGuard)
@Controller('api/business-account/register')
export class RegistrationController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Post('owner')
  async registerOwnerStaff(@Body() dto: RegisterOwnerStaffDto) {
    return await this.accountService.registerOwnerStaff(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('email-resend')
  async resendEmailVerificationForRegistration(@Req() req: Request) {
    await this.accountService.resendEmailVerification(req.currentUser.id, true);
  }

  @Post('email-verify')
  async verifyEmailCodeForRegistration(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: VerifyEmailCodeDto,
  ) {
    return await this.accountService.verifyEmailCode(
      res,
      req.currentUser.id,
      dto.code,
      true,
    );
  }
}
