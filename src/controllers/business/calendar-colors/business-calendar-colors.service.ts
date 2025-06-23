import {
  Injectable,
} from '@nestjs/common';
import { BusinessCalendarColorsRepository } from './business-calendar-colors.repository';
import { CalendarColorDto } from './dto/calendar-colors.dto';
import { BusinessRepository } from '../core/business.repository';

@Injectable()
export class BusinessCalendarColorsService {
  constructor(
    private readonly repo: BusinessCalendarColorsRepository,
    private readonly bizRepo: BusinessRepository,
  ) {}

  private async validateBusiness(businessId: number) {
    await this.bizRepo.getById(businessId); // Only validating business exists
  }

  async getAll(businessId: number) {
    await this.validateBusiness(businessId);
    return await this.repo.getAll(businessId);
  }

  async addColors(businessId: number, colors: CalendarColorDto[]) {
    await this.validateBusiness(businessId);
    await this.repo.addColors(businessId, colors);
  }

  async updateColors(businessId: number, colors: CalendarColorDto[]) {
    await this.validateBusiness(businessId);
    await this.repo.updateColors(businessId, colors);
  }
}
