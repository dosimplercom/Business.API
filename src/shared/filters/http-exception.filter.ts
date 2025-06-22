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
import { QueryFailedError } from 'typeorm';

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

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'resources.error.internal';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      if (typeof errorResponse === 'string') {
        message = errorResponse;
      } else if (
        errorResponse &&
        typeof errorResponse === 'object' &&
        'message' in errorResponse
      ) {
        const msg = (errorResponse as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      }
    } else if (exception instanceof QueryFailedError && exception.message) {
      // You can inspect or sanitize this further
      message = exception.message;
      status = HttpStatus.BAD_REQUEST; // or 404, or whatever makes sense
    }

    const lang =
      request.headers['accept-language'] ||
      request.headers['x-custom-lang'] ||
      'en';
    let translated = message;
    try {
      translated = await this.i18n.translate(message, {
        lang: Array.isArray(lang) ? lang[0] : lang,
      });
    } catch (er) {}

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
