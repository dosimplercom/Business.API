import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { BusinessModule } from 'src/controllers/business/business.module';
import { AccountModule } from 'src/controllers/account/account.module';
import { EmailSenderModule } from 'src/shared/modules/email-sender/email-sender.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from 'src/entities/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    BusinessModule,
    AccountModule,
    EmailSenderModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
