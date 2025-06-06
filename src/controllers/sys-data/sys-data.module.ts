import { SysDataService } from './sys-data.service';
import { SysDataController } from './sys-data.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDay } from 'src/entities/sys-day.entity';
import { SysTimeZone } from 'src/entities/sys-time-zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SysDay, SysTimeZone ])],
  controllers: [SysDataController],
  providers: [SysDataService],
})
export class SysDataModule {}