import { Module } from '@nestjs/common'; 
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from 'src/entities/business.entity';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { BusinessRepository } from './business.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Business]), AccountModule],
  controllers: [BusinessController],
  providers: [BusinessService, BusinessRepository],
})
export class BusinessModule {}
