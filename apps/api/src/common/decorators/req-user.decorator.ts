import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { RequestUser } from '@common/types';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.user as RequestUser;
  }
);
