import Redis from 'ioredis';
import { RedisModule as CustomRedisModule } from './redis.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const DB_REDIS_MODULE = 'DB_REDIS_MODULE';

export const DBRedisModule = CustomRedisModule.registerAsync({
  provide: DB_REDIS_MODULE,
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => ({
    connectionOptions: {
      host: config.getOrThrow('REDIS_HOST'),
      port: config.getOrThrow('REDIS_PORT'),
      username: config.getOrThrow('REDIS_USER'),
      password: config.getOrThrow('REDIS_PASSWORD'),
      family: Number(config.get('REDIS_FAMILY') ?? '0'),
      db: Number(config.get('REDIS_DB_DATABASE') ?? '0'),
      onClientReady: async (client: Redis, logger?: Logger) => {
        logger.log('Connected to redis instance');
      },
    },
  }),
  inject: [ConfigService],
});
