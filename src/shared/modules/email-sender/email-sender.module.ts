import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';
import { EmailTokenRepository } from './email-token.repository';
import { EmailToken } from 'src/entities/email-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([EmailToken])],
  exports: [EmailSenderService, EmailTokenRepository],
  providers: [EmailSenderService, EmailTokenRepository],
})
export class EmailSenderModule {}
