// auth/light-auth.guard.ts
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
export class LightAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (payload && payload['id']) {
        request.currentUser = payload;
        return true;
      }
      
      throw new ForbiddenException('Invalid token payload');
    } catch (err) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
