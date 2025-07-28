import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../users.entity';

interface ReqWithCurrentUser extends Request {
  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: ReqWithCurrentUser, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = (await this.usersService.findOne(userId)) as User;
      req.currentUser = user;
    }

    next();
  }
}
