import { Module } from '@nestjs/common';
import { StaffServiceController } from './staff-service.controller';
import { StaffServiceService } from './staff-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../../../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), AccountModule],
  controllers: [StaffServiceController],
  providers: [StaffServiceService],
})
export class StaffServiceModule {}
