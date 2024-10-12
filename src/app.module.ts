import { Global, Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DB_REDIS_MODULE, DBRedisModule } from './redis';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppProtectedController } from './app-protected.controller';
import { SearchModule } from './search/search.module';
import Redis from 'ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { UrlModule } from './url/url.module';
import { SearchIndexModule } from './search-index/search-index.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DBRedisModule,
    AuthModule,
    PrismaModule,
    UserModule,
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          issuer: config.getOrThrow<string>('JWT_ISSUER'),
          expiresIn: config.getOrThrow<string>('JWT_EXPIRES_IN'),
        },
        verifyOptions: {
          issuer: config.getOrThrow<string>('JWT_ISSUER'),
        },
      }),
      inject: [ConfigService],
    }),
    SearchModule,
    UrlModule,
    SearchIndexModule,
  ],
  controllers: [AppController, AppProtectedController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule implements OnModuleInit {
  private logger = new Logger(AppModule.name);
  constructor(@Inject(DB_REDIS_MODULE) private redis: Redis) {}

  async onModuleInit() {
    const jsonString = await this.redis.get('settings');
    if (!jsonString) {
      this.logger.verbose('Settings object not found, initializing default');
      await this.redis.set(
        'settings',
        JSON.stringify({
          searchOn: false,
          addNew: false,
          amount: 0,
        }),
      );
    }
  }
}
