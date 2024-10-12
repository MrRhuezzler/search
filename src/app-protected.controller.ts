import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guard/auth.guard';
import { SettingsUpdateDto } from './dto/settings.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import AllowedRoles from './user/decorator/allowedRoles.decorator';
import { UserRole } from './user/dto/user.dto';
import { AppService } from './app.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SearchService } from './search/search.service';

@Controller()
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AppProtectedController {
  private SETTINGS_KEY = 'settings';

  constructor(
    private app: AppService,
    private search: SearchService,
    private readonly scheduler: SchedulerRegistry,
  ) {}

  @Get('settings')
  @AllowedRoles([UserRole.ADMIN])
  async getSettings() {
    return this.app.getSettings();
  }

  @Put('settings')
  @AllowedRoles([UserRole.ADMIN])
  async updateSettings(@Body() body: SettingsUpdateDto) {
    return this.app.updateSettings(body);
  }

  // @Post('engine/crawl')
  // @AllowedRoles([UserRole.ADMIN])
  // async requestCrawling() {
  //   try {
  //     this.scheduler.deleteTimeout('crawl');
  //   } catch (err) {
  //   } finally {
  //     this.scheduler.addTimeout(
  //       'crawl',
  //       setTimeout(() => this.search.crawlEngine.bind(this.search), 100),
  //     );
  //   }

  //   return {};
  // }

  // @Post('engine/index')
  // @AllowedRoles([UserRole.ADMIN])
  // async requestIndexing() {
  //   this.scheduler.deleteTimeout('index');
  //   this.scheduler.addTimeout(
  //     'index',
  //     setTimeout(this.search.indexEngine, 100),
  //   );
  // }
}
