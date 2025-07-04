import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountRepository } from 'src/controllers/account/account.repository';
import { StaffWorkingHour } from 'src/entities/staff-working-hour.entity';
import { Repository } from 'typeorm';
import {
  StaffWorkingHoursCreateDto,
  StaffWorkingHoursUpdateDto,
} from './dto/staff-working-hours-create.dto';

@Injectable()
export class StaffWorkingHoursService {
  constructor(
    @InjectRepository(StaffWorkingHour)
    private whRepo: Repository<StaffWorkingHour>,
    private readonly accountRepo: AccountRepository,
  ) {}

  private async validateCaller(userId: number, businessId: number) {
    await this.accountRepo.getById(userId, businessId);
  }

  async getAll(callerId: number, staffId: number, businessId: number) {
    await this.validateCaller(callerId, businessId);
    await this.validateCaller(staffId, businessId);
    return this.whRepo.find({
      where: { entity_id: staffId, is_date_specific: false },
      order: { sys_day_id: 'ASC', from_date: 'ASC' },
      select: ['id', 'entity_id', 'sys_day_id', 'from_date', 'to_date'],
    });
  }

  async getOne(id: number) {
    const record = await this.whRepo.findOne({
      where: { id },
      select: ['id', 'entity_id', 'sys_day_id', 'from_date', 'to_date'],
    });
    if (!record) throw new NotFoundException('Working hour not found');
    return record;
  }

  async add(staff_id: number, dto: StaffWorkingHoursCreateDto) {
    const created = this.whRepo.create({
      ...dto,
      entity_id: staff_id,
      is_date_specific: false,
    });
    return this.whRepo.save(created);
  }

  async update(id: number, staff_id: number, dto: StaffWorkingHoursUpdateDto) {
    const existing = await this.whRepo.findOne({
      where: { id, entity_id: staff_id },
    });
    if (!existing) throw new NotFoundException('resources.status.not_found');

    Object.assign(existing, dto);
    return this.whRepo.save(existing);
  }

  async delete(id: number) {
    const deleted = await this.whRepo.delete(id);
    if (!deleted.affected)
      throw new NotFoundException('Working hour not found');
    return { message: 'Deleted' };
  }

  async deleteForDay(staff_id: number, sys_day_id: number) {
    await this.whRepo.manager.transaction(async (manager) => {
      // Get all entries sorted by from_date
      const entries = await manager.find(StaffWorkingHour, {
        where: { entity_id: staff_id, sys_day_id },
        order: { from_date: 'ASC' },
      });

      if (entries.length === 0) {
        throw new NotFoundException('No working hours found for this day');
      }

      const [keep, ...toDelete] = entries;

      // Delete all but the first one
      if (toDelete.length > 0) {
        await manager.remove(toDelete);
      }

      // Set from_date and to_date to null on the one we keep
      keep.from_date = null;
      keep.to_date = null;
      await manager.save(keep);
    });

    return {
      message: 'Working hours for the day deleted (except one nullified row)',
    };
  }
}
