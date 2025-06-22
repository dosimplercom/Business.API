import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticatedGuard } from '../../shared/guards/jwt-auth.guard';
import {
  AppointmentApprovalPayloadDto,
  BusinessCreateDto,
  SupportedLanguagesPayloadDto,
} from './dto/business.dto';
import { Request, Response } from 'express';
import { LightAuthenticatedGuard } from 'src/shared/guards/light-auth.guard';
import { BusinessService } from './business.service';

@Controller('api/business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @UseGuards(LightAuthenticatedGuard)
  @Post('create')
  async register(
    @Body() dto: BusinessCreateDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return await this.businessService.register(dto, req.currentUser?.id, res);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('get')
  async getBusiness(@Req() req: Request) {
    return this.businessService.get(req.currentUser.business_id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('supported-languages')
  async getLanguages(@Req() req: Request) {
    return this.businessService.getSupportedLanguages(
      req.currentUser.business_id,
      req.currentUser.id,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Put('supported-languages')
  async setLanguages(
    @Req() req: Request,
    @Body() dto: SupportedLanguagesPayloadDto,
  ) {
    return this.businessService.setSupportedLanguages(
      req.currentUser.business_id,
      req.currentUser.id,
      dto,
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Put('appointment-requires-approval')
  async setAppointmentApproval(
    @Req() req: Request,
    @Body() dto: AppointmentApprovalPayloadDto,
  ) {
    return this.businessService.setAppointmentApproval(
      req.currentUser.business_id,
      dto,
    );
  }
}
