import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';

declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: number;
        full_name: string;
        email: string;
        refresh: string;
        business_id?: number;
      };
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //come back to this later. Do we need this middleware?
    // probably we can use the JwtAuthGuard instead.

    // const { id } = req.currentUser || {};
    // console.log(`CurrentUserMiddleware is running, id=${id}`);
    // if (id) {
    //   const user = await this.usersService.findOne(id);
    //   req.currentUser = user;
    // }

    next();
  }
}
