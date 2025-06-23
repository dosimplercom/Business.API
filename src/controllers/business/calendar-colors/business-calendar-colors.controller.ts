import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BusinessCalendarColorsService } from './business-calendar-colors.service';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { Request } from 'express';
import { CalendarColorArrayDto } from './dto/calendar-colors.dto';

@UseGuards(AuthenticatedGuard)
@Controller('api/business/calendar-colors')
export class BusinessCalendarColorsController {
  constructor(private readonly service: BusinessCalendarColorsService) {}

  @Get('get-all')
  async getColors(@Req() req: Request) {
    return await this.service.getAll(req.currentUser.business_id);
  }

  @Post('add')
  @HttpCode(HttpStatus.NO_CONTENT)
  async addColors(@Req() req: Request, @Body() body: CalendarColorArrayDto) {
    await this.service.addColors(req.currentUser.business_id, body.colors);
  }

  @Put('update')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateColors(@Req() req: Request, @Body() body: CalendarColorArrayDto) {
    await this.service.updateColors(req.currentUser.business_id, body.colors);
  }
}
