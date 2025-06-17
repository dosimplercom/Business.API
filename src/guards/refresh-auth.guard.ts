// auth/refresh-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RefreshAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token');
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      if (payload && payload['id'] && payload['business_id']) {
        request.currentUser = payload;
        return true;
      }
      throw new ForbiddenException('Invalid token payload');
    } catch (err) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }
}
