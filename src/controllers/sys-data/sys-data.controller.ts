import { Controller, Get } from '@nestjs/common';
import { SysDataService } from './sys-data.service';
import { BaseController } from 'src/shared/base/base.controller';
import { TranslationService } from 'src/i18n/translation.service';

@Controller('sys')
export class SysDataController extends BaseController {
  constructor(
    private service: SysDataService,
    private readonly translationService: TranslationService,
  ) {
    super();
  }
  @Get('days')
  async getSysData() {
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

  @Get('hello')
  greet() {
    return this.translationService.t('resources.general.welcome');
  }
}
