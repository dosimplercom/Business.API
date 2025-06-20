import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Body,
  Param,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  RegisterOwnerStaffDto,
  RegisterBusinessStaffDto,
  LoginDto,
  VerifyEmailCodeDto,
  ResetPasswordDto,
  UpdateStaffDto,
  ForgotPasswordDto,
} from './dto/account.dto';
import { LightAuthenticatedGuard } from 'src/guards/light-auth.guard';
import { AuthenticatedGuard } from 'src/guards/jwt-auth.guard';
import { RefreshAuthenticatedGuard } from 'src/guards/refresh-auth.guard';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('register')
  async registerOwnerStaff(@Body() dto: RegisterOwnerStaffDto) {
    return await this.accountService.registerOwnerStaff(dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('register/email/resend')
  @UseGuards(LightAuthenticatedGuard)
  async resendEmailVerificationForRegistration(@Req() req: Request) {
    await this.accountService.resendEmailVerification(req.currentUser.id, true);
  }

  @Post('register/email/verify')
  @UseGuards(LightAuthenticatedGuard)
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

  @Post('login')
  async loginAccount(@Body() dto: LoginDto) {
    return await this.accountService.loginAccount(dto);
  }
  @Post('logout')
  async logoutUser(@Res({ passthrough: true }) res: Response) {
    this.accountService.logoutUser(res);
    return { message: 'Logged out successfully' };
  }
  @Put('forgotPassword')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.accountService.forgotPassword(dto.email);
  }
  @Put('resetPassword')
  @UseGuards(LightAuthenticatedGuard)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.accountService.resetPassword(dto);
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('login/email/resend')
  @UseGuards(LightAuthenticatedGuard)
  async resendEmailVerificationForLogin(@Req() req: Request) {
    const userId = req.currentUser.id;
    await this.accountService.resendEmailVerification(userId, false);
  }

  @Post('login/email/verify')
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

  @Get('customer')
  @UseGuards(LightAuthenticatedGuard)
  async getAllCustomers(@Req() req: Request) {
    return await this.accountService.getAllCustomers(
      req.currentUser.business_id,
    );
  }

  @Get('staff')
  @UseGuards(AuthenticatedGuard)
  async getAllStaff(@Req() req: Request) {
    return await this.accountService.getAllStaff(req.currentUser.business_id);
  }

  @Post('staff')
  @UseGuards(AuthenticatedGuard)
  async registerBusinessStaff(
    @Req() req: Request,
    @Body() dto: RegisterBusinessStaffDto,
  ) {
    return await this.accountService.registerBusinessStaff(
      req.currentUser.business_id,
      dto,
    );
  }

  @Put('staff/:staff_id')
  @UseGuards(AuthenticatedGuard)
  async updateStaff(
    @Req() req: Request,
    @Param('staff_id') staff_id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    const user = req.currentUser;
    return await this.accountService.updateStaff(
      +staff_id,
      dto,
      dto,
      user.business_id,
      user.id,
    );
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('staff/:staff_id')
  @UseGuards(AuthenticatedGuard)
  async deleteStaff(@Req() req: Request, @Param('staff_id') staffId: string) {
    await this.accountService.deleteStaff(
      +staffId,
      req.currentUser.business_id,
      req.currentUser.id,
    );
  }

  @Get('role/all')
  @UseGuards(AuthenticatedGuard)
  async getAllRoles(@Req() req: Request) {
    return await this.accountService.getAllRoles(req.currentUser.business_id);
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
