import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { BusinessController } from './core/business.controller';
import { BusinessService } from './core/business.service';
import { BusinessRepository } from './core/business.repository';
import { WorkingHoursController } from './working-hours/working-hours.controller';
import { BusinessCalendarColorsController } from './calendar-colors/business-calendar-colors.controller';
import { BusinessCalendarColorsService } from './calendar-colors/business-calendar-colors.service';
import { BusinessCalendarColorsRepository } from './calendar-colors/business-calendar-colors.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Business]), AccountModule],
  controllers: [
    BusinessCalendarColorsController,
    BusinessController,
    WorkingHoursController,
  ],
  providers: [
    BusinessService,
    BusinessRepository,
    BusinessCalendarColorsService,
    BusinessCalendarColorsRepository,
  ],
  exports: [
    BusinessService,
    BusinessRepository,
    BusinessCalendarColorsService,
    BusinessCalendarColorsRepository,
  ],
})
export class BusinessModule {}
