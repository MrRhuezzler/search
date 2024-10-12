import {
  DynamicModule,
  FactoryProvider,
  Logger,
  Module,
  ModuleMetadata,
} from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';

type RedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis, logger?: Logger) => Promise<void>;
};

type RedisAsyncModuleOptions = {
  provide: string;
  isGlobal?: boolean;
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

@Module({})
export class RedisModule {
  static async registerAsync({
    useFactory,
    imports,
    inject,
    provide,
    isGlobal,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    const logger = new Logger(RedisModule.name);
    const redisProvider = {
      provide,
      useFactory: async (...args) => {
        const { connectionOptions, onClientReady } = await useFactory(...args);
        const client = new IORedis(connectionOptions);
        await onClientReady?.(client, logger);
        return client;
      },
      inject,
    };

    return {
      global: isGlobal ?? false,
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
