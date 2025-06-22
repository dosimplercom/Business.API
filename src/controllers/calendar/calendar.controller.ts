import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { GetSchedulerEventsDto } from './dto/calendar.dto';
import { AuthenticatedGuard } from 'src/shared/guards/jwt-auth.guard';
import { Request } from 'express';
@UseGuards(AuthenticatedGuard)
@Controller('api/calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post('load')
  async getSchedulerEvents(
    @Body() dto: GetSchedulerEventsDto,
    @Req() req: Request,
  ) {
    return await this.calendarService.getEvents(
      dto,
      req.currentUser?.business_id,
    );
  }
}
