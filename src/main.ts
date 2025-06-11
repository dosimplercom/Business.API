import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from './config/cors.config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.enableCors(corsOptions);

  //Disabling automatic caching
  (app as any).set('etag', false);
  app.use((req, res, next) => {
    //Hiding tech stack, like Express or NestJS
    res.removeHeader('x-powered-by');
    //Removing time info, server time, etc.
    res.removeHeader('server');
    res.removeHeader('date');
    next();
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
}
bootstrap();
