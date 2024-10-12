import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { LoggedInUser } from './decorator/loggedIn.decorator';
import { UserResponseDto } from './dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AllowAllRoles } from './decorator/allowedRoles.decorator';
import { User } from '@prisma/client';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user/me')
@UseGuards(AuthGuard)
export class UserProtectedController {
  @Get()
  @AllowAllRoles
  async me(@LoggedInUser() user: User) {
    return new UserResponseDto(user);
  }
}
