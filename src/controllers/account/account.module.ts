import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { AuthService } from './auth.service';
import { TranslationModule } from 'src/i18n/translation.module';
import { EmailSenderModule } from 'src/shared/modules/email-sender/email-sender.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, AuthService],
  imports: [TranslationModule, EmailSenderModule],
  exports: [AccountService, AccountRepository, AuthService],
})
export class AccountModule {}
