import { Injectable } from '@nestjs/common';
import { BusinessWorkingHoursRepository } from './working-hours.repository';
import { BusinessWorkingHoursPayloadDTO } from './dto/business-workinghours.dto';

@Injectable()
export class BusinessWorkingHoursService {
  constructor(private readonly repo: BusinessWorkingHoursRepository) {}

  async add(business_id: number, dto: BusinessWorkingHoursPayloadDTO) {
    return await this.repo.add(business_id, dto);
  }

  async getAll(business_id: number) {
    return this.repo.getAllByBusinessId(business_id);
  }

  async get(id: number) {
    return await this.repo.getById(id);
  }

  async update(id: number, dto: BusinessWorkingHoursPayloadDTO) {
    return await this.repo.update(id, dto);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }

  async deleteForDay(business_id: number, sys_day_id: number) {
    return await this.repo.deleteForDay(business_id, sys_day_id);
  }
}
