import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import AllowedRoles from 'src/user/decorator/allowedRoles.decorator';
import { UserRole } from 'src/user/dto/user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly reflector: Reflector,
    private readonly user: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles =
      this.reflector.get(AllowedRoles, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token)
      throw new ForbiddenException('You are forbidden to access this endpoint');

    try {
      const payload = await this.auth.verifyToken(token);
      request.user = await this.user.findOne({ where: { email: payload.aud } });

      return allowedRoles.indexOf(request?.user?.role as UserRole) > -1;
    } catch (err) {
      throw new UnauthorizedException('JWT expired');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
