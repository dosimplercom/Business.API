/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { SysTimeZone } from 'src/entities/sys-time-zone.entity';
import { sys_data_type_enum } from 'src/enums/data_type_enum';
import { sys_language_enum } from 'src/enums/language.enum';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SysDataService {
  constructor(
    @InjectRepository(SysTimeZone)
    private repTZ: Repository<SysTimeZone>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  async getDays(lan: sys_language_enum) {
    try {
      const sql = 'SELECT id, name FROM public.get_data_for_ddl($1, $2)';
      return await this.dataSource.query(sql, [
        sys_data_type_enum.sys_day,
        lan,
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      return new UnprocessableEntityException({
        message: 'Error fetching data',
      });
    }
  }
  async getIndustries(lan: sys_language_enum) {
    try {
      const sql = 'SELECT id, name FROM public.get_data_for_ddl($1, $2)';
      return await this.dataSource.query(sql, [
        sys_data_type_enum.sys_industry,
        lan,
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      return new UnprocessableEntityException({
        message: 'Error fetching data',
      });
    }
  }
  async getTimezones() {
    return await this.repTZ.find();
    //return res.map((row: any) => { id: row.id, row.name, row.tz_code });
  }
}
