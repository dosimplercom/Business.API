/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get } from '@nestjs/common';
import { SysDataService } from './sys-data.service';
import { sys_language_enum } from 'src/enums/language.enum';

@Controller('sys')
export class SysDataController {
  constructor(private service: SysDataService) {}
  @Get('days')
  async getSysData() {
    return await this.service.getDays(sys_language_enum.en);//todo: language from locale
  }
  @Get('industries')
  async getIndustries() {
    return await this.service.getIndustries(sys_language_enum.en);//todo: language from locale
  }
  @Get('timezones')
  async getTimezones() {
    return await this.service.getTimezones();
  }
}
