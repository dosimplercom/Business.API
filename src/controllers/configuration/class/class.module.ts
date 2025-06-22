import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ClassRepository } from './class.repository';
import { BusinessModule } from 'src/controllers/business/business.module';
 
@Module({
  imports: [BusinessModule],
  controllers: [ClassController],
  providers: [ClassService, ClassRepository],
})
export class ClassModule {}
