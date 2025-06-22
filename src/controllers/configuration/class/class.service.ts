import { BadRequestException, Injectable } from '@nestjs/common';
import { ClassRepository } from './class.repository';
import { ClassManipulationDto } from './dto/class.dto';
import { BusinessRepository } from 'src/controllers/business/core/business.repository';

@Injectable()
export class ClassService {
  constructor(
    private readonly classRepo: ClassRepository,
    private readonly businessRepo: BusinessRepository,
  ) {}

  private async validateBusiness(business_id: number): Promise<void> {
    await this.businessRepo.getById(business_id);
  }

  private async validateClass(id: number, business_id: number): Promise<void> {
    if (!id || !business_id) {
      throw new BadRequestException('status.not_found');
    }
    await this.validateBusiness(business_id);

    const classExist = await this.classRepo.getById(id, business_id);
    if (!classExist || classExist.length === 0) {
      throw new BadRequestException('status.not_found');
    }
  }

  async getAll(business_id: number) {
    await this.validateBusiness(business_id);
    return this.classRepo.getAllClasses(business_id);
  }

  async getById(id: number, business_id: number) {
    await this.validateClass(id, business_id);
    return (await this.classRepo.getById(id, business_id))[0];
  }

  async add(data: ClassManipulationDto, business_id: number) {
    await this.validateBusiness(business_id);
    const newClass = await this.classRepo.add(data, business_id);
    if (!newClass) throw new BadRequestException('status.not_found');
    return newClass;
  }

  async update(id: number, data: ClassManipulationDto, business_id: number) {
    await this.validateClass(id, business_id);
    const updatedClass = await this.classRepo.update(id, data);
    if (!updatedClass) throw new BadRequestException('status.not_found');
    return updatedClass;
  }

  async delete(id: number, business_id: number) {
    await this.validateClass(id, business_id);
    await this.classRepo.delete(id, business_id);
  }
}
