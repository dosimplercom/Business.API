import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { BusinessController } from './core/business.controller';
import { BusinessService } from './core/business.service';
import { BusinessRepository } from './core/business.repository';
import { BusinessWorkingHoursController } from './working-hours/working-hours.controller';
import { BusinessCalendarColorsController } from './calendar-colors/business-calendar-colors.controller';
import { BusinessCalendarColorsService } from './calendar-colors/business-calendar-colors.service';
import { BusinessCalendarColorsRepository } from './calendar-colors/business-calendar-colors.repository';
import { BusinessCalendarColors } from 'src/entities/business-calendar-colors.entity';
import { BusinessWorkingHour } from 'src/entities/business-working-hour.entity';
import { BusinessWorkingHoursService } from './working-hours/business-workinghours.service';
import { BusinessWorkingHoursRepository } from './working-hours/working-hours.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Business,
      BusinessCalendarColors,
      BusinessWorkingHour,
    ]),
    AccountModule,
  ],
  controllers: [
    BusinessCalendarColorsController,
    BusinessController,
    BusinessWorkingHoursController,
  ],
  providers: [
    BusinessService,
    BusinessRepository,
    BusinessCalendarColorsService,
    BusinessCalendarColorsRepository,
    BusinessWorkingHoursService,
    BusinessWorkingHoursRepository,
  ],
  exports: [
    BusinessService,
    BusinessRepository,
    BusinessCalendarColorsService,
    BusinessCalendarColorsRepository,
  ],
})
export class BusinessModule {}
