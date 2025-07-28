import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/users/users.entity';

export interface CurrentUser {
  currentUser?: { admin: boolean } & User;
}

type ReqWithCurrentUser = Request & CurrentUser;

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ReqWithCurrentUser>();

    if (!request.currentUser)
      throw new UnauthorizedException('you dont have admin privillage');

    return request.currentUser.admin;
  }
}
