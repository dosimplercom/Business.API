/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { VerificationCodeService } from './verification-code.service';
import { EmailToken } from 'src/entities/email-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmailToken])],
  exports: [EmailSenderService, VerificationCodeService],
  providers: [EmailSenderService, VerificationCodeService],
})
export class EmailSenderModule {}
