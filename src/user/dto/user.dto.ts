import { ApiHideProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class UserCreateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserResponseDto implements User {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @ApiHideProperty()
  password: string;

  @Expose()
  role: string;

  @ApiHideProperty()
  createdAt: Date;

  @ApiHideProperty()
  updatedAt: Date;

  constructor(partial: Partial<User> | Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
