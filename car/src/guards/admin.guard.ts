import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export interface CurrentUser {
  currnetUser?: { admin: boolean };
}

type ReqWithCurrentUser = Request & CurrentUser;

export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ReqWithCurrentUser>();

    if (!request.currnetUser)
      throw new UnauthorizedException('you dont have admin privillage');

    return request.currnetUser.admin;
  }
}
