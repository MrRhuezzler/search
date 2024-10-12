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
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      db: Number(config.get('REDIS_DB_DATABASE') ?? '0'),
      onClientReady: async (client: Redis, logger?: Logger) => {
        logger.log('Connected to redis instance');
      },
    },
  }),
  inject: [ConfigService],
});
