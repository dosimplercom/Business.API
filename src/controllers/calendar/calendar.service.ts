import { Injectable } from '@nestjs/common';
import { CalendarRepository } from './calendar.repository';
import { AccountRepository } from '../account/account.repository';
import { GetSchedulerEventsDto } from './dto/calendar.dto';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarRepo: CalendarRepository,
    private readonly accountRepo: AccountRepository,
  ) {}

  private async validateCaller(id: number, business_id: number): Promise<void> {
    await this.accountRepo.getById(id, business_id);
  }

  async getEvents(dto: GetSchedulerEventsDto, business_id: number) {
    await this.validateCaller(dto.staff_id, business_id);

    const appointments = await this.calendarRepo.getEvents(
      dto.staff_id,
      business_id,
      new Date(dto.start_date),
      new Date(dto.end_date),
    );

    return appointments || [];
  }
}
