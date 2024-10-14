import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProtectedController } from './user-protected.controller';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController, UserProtectedController],
})
export class UserModule implements OnModuleInit {
  private readonly logger = new Logger(UserModule.name);

  constructor(
    private readonly user: UserService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const adminUser = await this.user.findOne({
      where: { email: this.config.get('ADMIN_USER_EMAIL') },
    });

    if (!adminUser) {
      this.logger.verbose('Admin user added');
      await this.user.create({
        data: {
          email: this.config.get('ADMIN_USER_EMAIL'),
          password: this.config.get('ADMIN_USER_PASSWORD'),
        },
      });
    } else {
      this.logger.verbose('Admin user already exists');
    }
  }
}
