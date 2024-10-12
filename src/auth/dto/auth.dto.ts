import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserTokenResponseDto {
  @Expose()
  id: string;

  @Expose()
  token: string;

  constructor(partial: Partial<UserTokenResponseDto>) {
    Object.assign(this, partial);
  }
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
