import { Controller, Get } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { BaseController } from 'src/shared/base/base.controller';

@Controller()
export class AppController extends BaseController {
  @Get()
  getHello(@I18n() i18n: I18nContext): string {
    return i18n.t('resources.general.welcome');
  }
  @Get('/health')
  healthCheck(@I18n() i18n: I18nContext): string {
    return i18n.t('resources.general.healthy');
  }
}
