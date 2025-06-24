import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessWorkingHour } from 'src/entities/business-working-hour.entity';
import { Repository, DataSource } from 'typeorm';
import { BusinessWorkingHoursCreationPayloadDTO, BusinessWorkingHoursPayloadDTO } from './dto/business-workinghours.dto';

@Injectable()
export class BusinessWorkingHoursRepository {
  constructor(
    @InjectRepository(BusinessWorkingHour)
    private readonly repo: Repository<BusinessWorkingHour>,
    private readonly dataSource: DataSource,
  ) {}

  async add(business_id: number, data: BusinessWorkingHoursCreationPayloadDTO) {
    const newWH = this.repo.create({
      ...data,
      business_id: business_id,
      is_date_specific: false,
    });
    return this.repo.save(newWH);
  }

  async getById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async getAllByBusinessId(business_id: number) {
    return this.repo.find({
      where: { business_id },
      select: ['id', 'sys_day_id', 'from_date', 'to_date'],
    });
  }

  async update(id: number, data: BusinessWorkingHoursPayloadDTO) {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } });
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async deleteForDay(business_id: number, sys_day_id: number) {
    await this.dataSource.query(
      'CALL delete_business_working_hours_for_day($1, $2)',
      [sys_day_id, business_id],
    );

    return { success: true };
  }
}