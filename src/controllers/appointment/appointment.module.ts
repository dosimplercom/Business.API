import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { TranslationModule } from 'src/i18n/translation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from '../account/account.module';

@Module({
  controllers: [AppointmentController],
  providers: [AppointmentService],
  imports: [TypeOrmModule.forFeature([]), TranslationModule, AccountModule],
})
export class AppointmentModule {}
