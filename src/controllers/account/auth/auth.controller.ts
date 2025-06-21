import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  LoginDto,
  VerifyEmailCodeDto,
  ResetPasswordDto,
  ForgotPasswordDto,
} from '../dto/account.dto';
import { LightAuthenticatedGuard } from 'src/shared/guards/light-auth.guard';
import { RefreshAuthenticatedGuard } from 'src/shared/guards/refresh-auth.guard';
import { AccountService } from '../account.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly accountService: AccountService) {}

  @Post('login')
  async loginAccount(@Body() dto: LoginDto) {
    return await this.accountService.loginAccount(dto);
  }

  @Post('logout')
  async logoutUser(@Res({ passthrough: true }) res: Response) {
    this.accountService.logoutUser(res);
    return { message: 'Logged out successfully' };
  }

  @Put('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.accountService.forgotPassword(dto.email);
  }

  @Put('reset-password')
  @UseGuards(LightAuthenticatedGuard)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.accountService.resetPassword(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('email-resend')
  @UseGuards(LightAuthenticatedGuard)
  async resendEmailVerificationForLogin(@Req() req: Request) {
    const userId = req.currentUser.id;
    await this.accountService.resendEmailVerification(userId, false);
  }

  @Post('email-verify')
  @UseGuards(LightAuthenticatedGuard)
  async verifyEmailCodeForLogin(
    @Req() req: Request,
    @Body() dto: VerifyEmailCodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.currentUser.id;
    const result = await this.accountService.verifyEmailCode(
      res,
      userId,
      dto.code,
      false,
    );
    return result;
  }

  @Post('refresh-token')
  @UseGuards(RefreshAuthenticatedGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.accountService.refreshToken(
      res,
      req.currentUser.id,
      req.currentUser.business_id,
    );
  }
}
