import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { BusinessController } from './core/business.controller';
import { BusinessService } from './core/business.service';
import { BusinessRepository } from './core/business.repository';
import { WorkingHoursController } from './working-hours/working-hours.controller';
import { BusinessCalendarColorsController } from './calendar-colors/calendar-colors.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Business]), AccountModule],
  controllers: [BusinessController, WorkingHoursController, BusinessCalendarColorsController],
  providers: [BusinessService, BusinessRepository],
  exports: [BusinessService, BusinessRepository],
})
export class BusinessModule {}
