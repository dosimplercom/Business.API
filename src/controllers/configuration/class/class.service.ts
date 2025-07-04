import { BadRequestException, Injectable } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import { ClassDto, ClassManipulationPayloadDto } from './dto/class.dto';
import { BusinessRepository } from 'src/controllers/business/core/business.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ClassService {
  constructor(
    private readonly classRepo: ClassRepository,
    private readonly businessRepo: BusinessRepository,
  ) {}

  private async validateBusiness(business_id: number): Promise<void> {
    await this.businessRepo.getById(business_id);
  }

  private async validateClass(id: number, business_id: number) {
    if (!id || !business_id) {
      throw new BadRequestException('status.not_found');
    }
    await this.validateBusiness(business_id);

    const classExist = await this.classRepo.getById(id, business_id);
    if (!classExist) {
      throw new BadRequestException('status.not_found');
    }
    return classExist;
  }

  async getAll(business_id: number) {
    await this.validateBusiness(business_id);
    const clss = await this.classRepo.getAllClasses(business_id);
    return plainToInstance(ClassDto, clss);
  }

  async getById(id: number, business_id: number) {
    const cls = await this.validateClass(id, business_id);
    return plainToInstance(ClassDto, cls);
  }

  async add(data: ClassManipulationPayloadDto, business_id: number) {
    await this.validateBusiness(business_id);
    const newClass = await this.classRepo.add(data, business_id);
    if (!newClass) throw new BadRequestException('status.not_found');
    return plainToInstance(ClassDto, newClass);
  }

  async update(
    id: number,
    data: ClassManipulationPayloadDto,
    business_id: number,
  ) {
    await this.validateClass(id, business_id);
    const updatedClass = await this.classRepo.update(id, business_id, data);
    if (!updatedClass) throw new BadRequestException('status.not_found');
    return plainToInstance(ClassDto, updatedClass);
  }

  async delete(id: number, business_id: number) {
    await this.validateClass(id, business_id);
    await this.classRepo.delete(id, business_id);
  }
}
