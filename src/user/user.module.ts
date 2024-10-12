import { Global, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProtectedController } from './user-protected.controller';

@Global()
@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController, UserProtectedController],
})
export class UserModule {}
