import { Controller, Get } from '@nestjs/common';
import { SysDataService } from './sys-data.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { getLanguageId } from 'src/shared/global-functions';

@Controller('sys')
export class SysDataController {
  constructor(private service: SysDataService) {}
  @Get('days')
  async getSysData(@I18n() i18n: I18nContext) {
    return await this.service.getDays(getLanguageId(i18n.lang));
  }
  @Get('industries')
  async getIndustries(@I18n() i18n: I18nContext) {
    return await this.service.getIndustries(getLanguageId(i18n.lang)); 
  }
  @Get('timezones')
  async getTimezones() {
    return await this.service.getTimezones();
  }

  @Get('hello')
  greet(@I18n() i18n: I18nContext) {
    console.log('Detected language:', i18n.lang);

    return i18n.t('resources.general.welcome');
  }
}
