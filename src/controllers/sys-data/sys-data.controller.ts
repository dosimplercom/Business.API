import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SysDataService } from './sys-data.service';
import { BaseController } from 'src/shared/base/base.controller';
import { LightAuthenticatedGuard } from 'src/shared/guards/light-auth.guard';

@UseGuards(LightAuthenticatedGuard)
@Controller('api/sys')
export class SysDataController extends BaseController {
  constructor(private service: SysDataService) {
    super();
  }
  @Get('days')
  async getDays() {
    return await this.service.getDays();
  }
  @Get('industries')
  async getIndustries() {
    return await this.service.getIndustries();
  }
  @Get('timezones')
  async getTimezones() {
    return await this.service.getTimezones();
  }
  @Get('countries')
  async getCountries() {
    return await this.service.getCountries();
  }
  @Get(':country_id/state')
  async getStatesByCountry(@Query('country_id') country_id: string) {
    return await this.service.getStatesByCountry(+country_id);
  }
  @Get('languages')
  async getLanguages() {
    return await this.service.getLanguages();
  }
  @Get('appointment-status')
  async getAppointmentStatuses() {
    return await this.service.getAppointmentStatuses();
  }
}
