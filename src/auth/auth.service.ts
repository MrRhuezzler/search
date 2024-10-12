import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto, UserTokenResponseDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private user: UserService,
    private jwt: JwtService,
  ) {}

  async generateToken(email: string) {
    return this.jwt.signAsync(
      {},
      {
        audience: email,
      },
    );
  }

  async verifyToken(token: string) {
    return this.jwt.verifyAsync(token);
  }

  async register(data: UserCreateDto): Promise<UserTokenResponseDto> {
    const user = await this.user.create({
      data,
    });

    const token = await this.generateToken(user.email);

    return new UserTokenResponseDto({
      ...user,
      token,
    });
  }

  async login(data: LoginDto): Promise<UserTokenResponseDto> {
    const user = await this.user.findOne({
      where: {
        email: data.email,
      },
    });

    if (!user) throw new UnauthorizedException('Incorrect username or email');
    const passwordMatch = await argon2.verify(user.password, data.password);
    if (!passwordMatch)
      throw new UnauthorizedException('Incorrect username or password');

    const token = await this.generateToken(user.email);

    return new UserTokenResponseDto({
      ...user,
      token,
    });
  }
}
