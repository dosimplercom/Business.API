import { BadRequestException } from '@nestjs/common';

export class BaseController {
  badRequest(message: string | null = null): never {
    throw new BadRequestException(message || 'resources.error.payload');
  }
}
