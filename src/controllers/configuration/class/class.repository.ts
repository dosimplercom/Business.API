import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClassManipulationPayloadDto } from './dto/class.dto';
import { ClassEntity } from 'src/entities/class.entity';

function roundMinTo5(minutes: number) {
  if (minutes % 5 > 0) {
    return Math.round(minutes / 5) * 5;
  }
  return minutes;
}

@Injectable()
export class ClassRepository {
  constructor(
    @InjectRepository(ClassEntity)
    private readonly classRepo: Repository<ClassEntity>,
  ) {}

  async getAllClasses(business_id: number) {
    return this.classRepo.find({
      where: { business_id, deleted: false },
    });
  }

  async getById(id: number, business_id: number) {
    const cls = await this.classRepo.findOne({
      where: { id, business_id, deleted: false },
    });
    if (!cls) {
      throw new BadRequestException('resources.status.not_found');
    }
    return cls;
  }

  async add(data: ClassManipulationPayloadDto, business_id: number) {
    const cls = this.classRepo.create({
      business_id,
      name: data.name,
      description: data.description,
      default_duration_in_minutes: roundMinTo5(
        data.default_duration_in_minutes,
      ),
      default_buffer_time_in_minutes: roundMinTo5(
        data.default_buffer_time_in_minutes,
      ),
      default_cost: data.default_cost,
      capacity: data.capacity,
      available_for_online_booking: data.available_for_online_booking,
      deleted: false,
    });
    return this.classRepo.save(cls);
  }

  async update(
    id: number,
    business_id: number,
    data: ClassManipulationPayloadDto,
  ) {
    const cls = await this.getById(id, business_id);

    Object.assign(cls, {
      ...data,
      default_duration_in_minutes: roundMinTo5(
        data.default_duration_in_minutes,
      ),
      default_buffer_time_in_minutes: roundMinTo5(
        data.default_buffer_time_in_minutes,
      ),
    });

    return this.classRepo.save(cls);
  }

  async delete(id: number, business_id: number): Promise<void> {
    const cls = await this.getById(id, business_id);
    cls.deleted = true;
    await this.classRepo.save(cls);
  }
}
