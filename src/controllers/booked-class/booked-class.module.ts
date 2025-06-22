/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { BookedClassController } from './booked-class.controller';
import { BookedClassService } from './booked-class.service';
import { BookedClassRepository } from './booked-class.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationModule } from 'src/i18n/translation.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), TranslationModule, AccountModule],
  controllers: [BookedClassController],
  providers: [BookedClassService, BookedClassRepository],
  exports: [BookedClassService, BookedClassRepository],
})
export class BookedClassModule {}
