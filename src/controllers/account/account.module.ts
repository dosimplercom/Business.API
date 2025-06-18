import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { AuthService } from './auth.service';
import { TranslationModule } from 'src/i18n/translation.module';
import { EmailSenderModule } from 'src/shared/modules/email-sender/email-sender.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuth } from 'src/entities/user-auth.entity';
import { EntityModel } from 'src/entities/entity.entity';
import { Role } from 'src/entities/role.entity';

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, AuthService],
  imports: [
    TypeOrmModule.forFeature([UserAuth, EntityModel, Role]),
    TranslationModule,
    EmailSenderModule,
  ],
  exports: [AccountService, AccountRepository, AuthService],
})
export class AccountModule {}
