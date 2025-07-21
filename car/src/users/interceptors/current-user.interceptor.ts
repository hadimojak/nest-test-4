import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { User } from '../users.entity';

interface ReqWithCurrentUser extends Request {
  currentUser?: User;
}

@Injectable()
export class currentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<ReqWithCurrentUser>();
    const { userId } = (request.session as { userId?: number | null }) || {};

    if (userId) {
      const user = (await this.usersService.findOne(userId)) as User;
      request.currentUser = user;
    }

    return next.handle();
  }
}
