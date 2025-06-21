import { AccountModule } from './controllers/account/account.module';
import { TranslationModule } from './i18n/translation.module';
import { SysDataModule } from './controllers/sys-data/sys-data.module';
import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AppDataSource } from 'typeorm.config';
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
} from 'nestjs-i18n';
import * as path from 'path';
import { GlobalExceptionFilter } from './shared/filters/http-exception.filter';
import { RateLimiterMiddleware } from './shared/middleware/rate-limiter.middleware';
import { EmailSenderModule } from './shared/modules/email-sender/email-sender.module';
import { AppointmentModule } from './controllers/appointment/appointment.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    AppointmentModule,
    EmailSenderModule,
    AccountModule,
    TranslationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.env.${process.env.NODE_ENV}`
        : '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        pathPattern: '**/*.json',
        watch: true,
      },
      loader: I18nJsonLoader,
      resolvers: [
        AcceptLanguageResolver,
        //{ use: AcceptLanguageResolver, options: ['en', 'am', 'ru'] },
        //new HeaderResolver(['Accept-Language']),
      ],
    }),
    UsersModule,
    ReportsModule,
    SysDataModule,
  ],
  exports: [TranslationModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, // strip unknown props
        forbidNonWhitelisted: true, // throw error if unknown props are present
        transform: true, // convert payload to DTO instance
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {
  constructor() {
    // private configService: ConfigService
    console.log('AppModule Initialized');
    //console.log('PORT:', this.configService.get('PORT'));
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [process.env.COOKIE_KEY], //[this.configService.get('COOKIE_KEY')],
        }),
        RateLimiterMiddleware,
      )
      .forRoutes('*');
  }
}
