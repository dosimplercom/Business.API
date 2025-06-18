// src/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (request.url.startsWith('/.well-known/appspecific')) {
      return; // silently skip logging this error, this is coming from chrome devtools
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    // Try to get translated message
    let message = 'resources.error.internal';
    let translated = '';
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (
      errorResponse &&
      typeof errorResponse === 'object' &&
      'message' in errorResponse
    ) {
      translated = (errorResponse as any).message;
      if (Array.isArray(translated)) {
        translated = translated[0];
      }
    }

    if (!translated) {
      const lang =
        request.headers['accept-language'] ||
        request.headers['x-custom-lang'] ||
        'en';
      translated = await this.i18n.translate(message, {
        lang: Array.isArray(lang) ? lang[0] : lang,
      });
    }
    console.error(
      `[${request.method}]: ${request.url}
       ${translated} →
       `,
      exception,
    );

    response.status(status).json({
      statusCode: status,
      message: translated,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
