import { Module } from '@nestjs/common';
import { StaffServiceController } from './service/staff-service.controller';
import { StaffServiceService } from './service/staff-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../../account/account.module';
import { StaffWorkingHoursController } from './working-hours/staff-working-hours.controller';
import { StaffWorkingHour } from 'src/entities/staff-working-hour.entity';
import { StaffWorkingHoursService } from './working-hours/staff-working-hours.service';

@Module({
  imports: [TypeOrmModule.forFeature([StaffWorkingHour]), AccountModule],
  controllers: [StaffServiceController, StaffWorkingHoursController],
  providers: [StaffServiceService, StaffWorkingHoursService],
})
export class StaffConfigurationModule {}
