import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../../../entities/service.entity';
import { BusinessService } from '../../business/core/business.service';
import {
  CreateServiceDto,
  ServiceDto,
  UpdateServiceDto,
} from './dto/service.dto';
import { AccountRepository } from 'src/controllers/account/account.repository';
import { EmailSenderService } from 'src/shared/modules/email-sender/email-sender.service';
import { DateTime } from 'luxon';
import { roundMinTo5 } from 'src/shared/methods';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    private readonly accountRepo: AccountRepository,
    private readonly businessService: BusinessService,
    private readonly emailSenderService: EmailSenderService,
  ) {}

  async validateBusiness(business_id: number) {
    // Check if the business exists happening in the business service
    await this.businessService.get(business_id);
  }

  async validateService(id: number, business_id: number) {
    await this.validateBusiness(business_id);
    const service = await this.serviceRepo.findOne({
      where: { id, business_id, deleted: false },
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async getAll(business_id: number) {
    await this.validateBusiness(business_id);
    const services = await this.serviceRepo.find({
      where: { business_id, deleted: false },
    });
    return plainToInstance(ServiceDto, services);
  }

  async getOne(id: number, business_id: number) {
    const service = await this.validateService(id, business_id);
    return plainToInstance(ServiceDto, service);
  }

  async add(dto: CreateServiceDto, business_id: number) {
    await this.validateBusiness(business_id);

    const service = this.serviceRepo.create({
      ...dto,
      default_duration_in_minutes: roundMinTo5(dto.default_duration_in_minutes),
      default_buffer_time_in_minutes: roundMinTo5(
        dto.default_buffer_time_in_minutes,
      ),
      business_id,
      deleted: false,
    });
    const savedService = await this.serviceRepo.save(service);
    return plainToInstance(ServiceDto, savedService);
  }

  async update(id: number, dto: UpdateServiceDto, business_id: number) {
    const service = await this.validateService(id, business_id);
    Object.assign(service, {
      ...dto,
      updated_at: new Date(),
      default_duration_in_minutes: roundMinTo5(dto.default_duration_in_minutes),
      default_buffer_time_in_minutes: roundMinTo5(
        dto.default_buffer_time_in_minutes,
      ),
    });
    const savedService = await this.serviceRepo.save(service);
    return plainToInstance(ServiceDto, savedService);
  }

  async delete(id: number, business_id: number) {
    const service = await this.validateService(id, business_id);
    service.deleted = true;
    return this.serviceRepo.save(service);
  }

  async sendICSFile(userId: number, business_id: number) {
    await this.validateBusiness(business_id);
    const account = await this.accountRepo.getById(userId, business_id);

    const now = new Date();
    this.emailSenderService.sendEmailWithICS({
      entity_id: account.entity_id,
      recipientEmail: account.email,
      subject: 'this is .ics file test',
      message: 'This is a test email with an ICS file attachment.',
      icsData: {
        eventTitle: 'Test Event',
        description: 'This is a test event',
        location: 'Test Location',
        stampDate: DateTime.fromJSDate(now).toString('YYYYMMDDTHHmmss'),
        startDate: DateTime.fromMillis(
          now.getTime() + 7 * 24 * 60 * 60 * 1000,
        ).toString('YYYYMMDDTHHmmss'),
        endDate: DateTime.fromMillis(
          now.getTime() + 7 * 24 * 60 * 60 * 1000,
        ).toString('YYYYMMDDTHHmmss'),
      },
    });
    return { message: 'ICS file sent' };
  }
}
