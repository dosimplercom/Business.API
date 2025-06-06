import { SysDataModule } from './controllers/sys-data/sys-data.module';
import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { AppDataSource } from 'typeorm.config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
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
    UsersModule,
    ReportsModule,
    SysDataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('AppModule initialized');
    // console.log('Config Service:', this.configService);
    // console.log('Cookie Key:',process.env.COOKIE_KEY);
    // console.log('ENV', process.env.NODE_ENV);
    console.log('PORT:', this.configService.get('PORT'));
  }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [process.env.COOKIE_KEY], //[this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
