import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';

export interface CurrentUser {
  id: number;
  full_name: string;
  email: string;
  refresh: string;
  business_id?: number;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser;
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
