import { Module } from '@nestjs/common';
import { CustomerController } from './customer/customer.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './account.repository';
import { AuthService } from './auth/auth.service';
import { TranslationModule } from 'src/i18n/translation.module';
import { EmailSenderModule } from 'src/shared/modules/email-sender/email-sender.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAuth } from 'src/entities/user-auth.entity';
import { EntityModel } from 'src/entities/entity.entity';
import { Role } from 'src/entities/role.entity';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { StaffController } from './staff/staff.controller';
import { RegistrationController } from './register/register.controller';
import { AuthController } from './auth/auth.controller';
import { PreferenceController } from './preference/preference.controller';

@Module({
  controllers: [
    RegistrationController,
    AuthController,
    StaffController,
    CustomerController,
    RoleController,
    PreferenceController
  ],
  providers: [AccountService, RoleService, AccountRepository, AuthService],
  imports: [
    TypeOrmModule.forFeature([UserAuth, EntityModel, Role]),
    TranslationModule,
    EmailSenderModule,
  ],
  exports: [AccountService, RoleService, AccountRepository, AuthService],
})
export class AccountModule {}
