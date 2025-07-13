import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../users.entity';

interface ReqWithCurrentUser extends Request {
  currentUser?: User;
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest<ReqWithCurrentUser>();
    return req.currentUser;
  },
);
