import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarRepository } from './calendar.repository';
import { AccountModule } from '../account/account.module';

@Module({
  controllers: [CalendarController],
  imports: [AccountModule],
  providers: [CalendarService, CalendarRepository],
})
export class CalendarModule {}
