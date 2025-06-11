import { Injectable } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { sys_language_enum } from 'src/enums/language.enum';

@Injectable()
export class TranslationService {

  get language(): sys_language_enum {
    const lang = I18nContext.current()?.lang || 'en'; // fallback to default
    return (
      sys_language_enum[lang as keyof typeof sys_language_enum] ||
      sys_language_enum.en
    );
  }

  t(key: string, args?: Record<string, any>) {
    return I18nContext.current()?.t(key, args) ?? key;
  }
}