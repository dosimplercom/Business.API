import { SysDataService } from './sys-data.service';
import { SysDataController } from './sys-data.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDay } from 'src/entities/sys-day.entity';
import { SysTimeZone } from 'src/entities/sys-time-zone.entity';
import { TranslationModule } from 'src/i18n/translation.module';

@Module({
  imports: [TypeOrmModule.forFeature([SysDay, SysTimeZone]), TranslationModule],
  controllers: [SysDataController],
  providers: [SysDataService],
})
export class SysDataModule {}