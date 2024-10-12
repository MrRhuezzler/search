import { Injectable } from '@nestjs/common';
import { UserResponseDto } from './dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(args: Prisma.UserCreateArgs): Promise<UserResponseDto> {
    args.data.password = await argon2.hash(args.data.password);
    return this.prisma.user.create(args);
  }

  async findOne(args: Prisma.UserFindUniqueArgs): Promise<UserResponseDto> {
    return this.prisma.user.findUnique(args);
  }
}
