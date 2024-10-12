import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { SettingsReponseDto, SettingsUpdateDto } from './dto/settings.dto';
import { DB_REDIS_MODULE } from './redis';

@Injectable()
export class AppService {
  private SETTINGS_KEY = 'settings';

  constructor(@Inject(DB_REDIS_MODULE) private redis: Redis) {}

  health(): string {
    return 'Search Engine';
  }

  async getSettings(): Promise<SettingsReponseDto> {
    const jsonString = await this.redis.get(this.SETTINGS_KEY);
    return new SettingsReponseDto(JSON.parse(jsonString));
  }

  async updateSettings(data: SettingsUpdateDto): Promise<SettingsReponseDto> {
    const jsonString = await this.redis.get(this.SETTINGS_KEY);
    const settingsObject = { ...JSON.parse(jsonString), ...data };
    await this.redis.set(this.SETTINGS_KEY, JSON.stringify(settingsObject));
    return new SettingsReponseDto(settingsObject);
  }
}
