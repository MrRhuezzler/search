import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserResponseDto } from '../dto/user.dto';

export const LoggedInUser = createParamDecorator(
  (field: string | undefined, ctx: ExecutionContext): UserResponseDto => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (field) return request.user[field];
    return request.user;
  },
);
