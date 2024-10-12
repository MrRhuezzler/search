import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UserCreateDto } from 'src/user/dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.auth.login(body);
  }

  @Post('register')
  async register(@Body() body: UserCreateDto) {
    return this.auth.register(body);
  }
}
