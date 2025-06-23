import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarColorDto } from './dto/calendar-colors.dto';
import { BusinessCalendarColors } from 'src/entities/business-calendar-colors.entity';

@Injectable()
export class BusinessCalendarColorsRepository {
  constructor(
    @InjectRepository(BusinessCalendarColors)
    private readonly repo: Repository<BusinessCalendarColors>,
  ) {}

  async getAll(business_id: number) {
    const colors = await this.repo.find({
      where: { business_id },
      select: ['sys_color_type_id', 'color'],
    });

    return colors.map((c) => ({
      sys_color_type_id: c.sys_color_type_id,
      color: Number(c.color),
    }));
  }

  async addColors(business_id: number, colors: CalendarColorDto[]) {
    const entities = colors.map((dto) =>
      this.repo.create({
        business_id: business_id,
        sys_color_type_id: dto.sys_color_type_id,
        color: dto.color.toString(),
      }),
    );

    await this.repo.save(entities);
  }

  async updateColors(
    business_id: number,
    colors: CalendarColorDto[],
  ) {
    for (const dto of colors) {
      await this.repo.update(
        {
          business_id,
          sys_color_type_id: dto.sys_color_type_id,
        },
        {
          color: dto.color.toString(),
        },
      );
    }
  }
}
