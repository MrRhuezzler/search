import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly app: AppService) {}

  @Get('health')
  async health(): Promise<string> {
    return this.app.health();
  }
}
