import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

export interface SessionData {
  userId?: number;
}

type ReqWithSession = Request & { seesion?: SessionData };

export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<ReqWithSession>();

    if (!request.session?.userId) {
      throw new UnauthorizedException(
        'You must be logged in to access this route.',
      );
    }

    return true;
  }
}
