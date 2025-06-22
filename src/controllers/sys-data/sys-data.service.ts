// controllers/sys-data/sys-data.service.ts
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { sys_data_type_enum } from 'src/enums/data_type_enum';
import { TranslationService } from 'src/i18n/translation.service';
import { DataSource } from 'typeorm';

@Injectable()
export class SysDataService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly translationService: TranslationService,
  ) {}

  private async getSysData(sys_data: sys_data_type_enum) {
    try {
      const sql = 'SELECT id, name FROM public.get_data_for_ddl($1, $2)';
      return await this.dataSource.query(sql, [
        sys_data,
        this.translationService.language,
      ]);
    } catch (error) {
      console.error(`Error fetching sys data ${sys_data}:`, error);
      return new UnprocessableEntityException(
        'resources.error.error_fetching_date',
      );
    }
  }

  async getDays() {
    return await this.getSysData(sys_data_type_enum.sys_day);
  }
  async getIndustries() {
    return await this.getSysData(sys_data_type_enum.sys_industry);
  }
  async getAppointmentStatuses() {
    return this.getSysData(sys_data_type_enum.sys_appointment_status);
  }
  async getTimezones() {
    const sql = 'SELECT id, name, tz_code FROM sys_time_zone';
    return await this.dataSource.query(sql);
  }

  async getLanguages() {
    const sql = 'SELECT id, code, name, sort FROM sys_language ORDER BY sort';
    return await this.dataSource.query(sql);
  }

  async getCountries() {
    const sql = 'SELECT * FROM sys_country';
    return await this.dataSource.query(sql);
  }

  async getStatesByCountry(countryId: number) {
    const sql = 'SELECT * FROM sys_state WHERE country_id = $1';
    return await this.dataSource.query(sql, [countryId]);
  }
}
