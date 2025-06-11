// controllers/sys-data/sys-data.service.ts
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SysTimeZone } from 'src/entities/sys-time-zone.entity';
import { sys_data_type_enum } from 'src/enums/data_type_enum';
import { TranslationService } from 'src/i18n/translation.service';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SysDataService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(SysTimeZone) private repTZ: Repository<SysTimeZone>,
    private readonly translationService: TranslationService,
  ) {}
  async getDays() {
    try {
      const sql = 'SELECT id, name FROM public.get_data_for_ddl($1, $2)';
      return await this.dataSource.query(sql, [
        sys_data_type_enum.sys_day,
        this.translationService.language,
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      return new UnprocessableEntityException({
        message: this.translationService.t(
          'resources.error.error_fetching_date',
        ),
      });
    }
  }
  async getIndustries() {
    try {
      const sql = 'SELECT id, name FROM public.get_data_for_ddl($1, $2)';
      return await this.dataSource.query(sql, [
        sys_data_type_enum.sys_industry,
        this.translationService.language,
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      return new UnprocessableEntityException({
        message: this.translationService.t(
          'resources.error.error_fetching_date',
        ),
      });
    }
  }
  async getTimezones() {
    return await this.repTZ.find();
    //return res.map((row: any) => { id: row.id, row.name, row.tz_code });
  }
}
