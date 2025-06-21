import { SysDataService } from './sys-data.service';
import { SysDataController } from './sys-data.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationModule } from 'src/i18n/translation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      /* entities goes here */
    ]),
    TranslationModule,
  ],
  controllers: [SysDataController],
  providers: [SysDataService],
})
export class SysDataModule {}
