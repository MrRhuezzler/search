import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/guard/auth.guard';
import { SettingsUpdateDto } from './dto/settings.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import AllowedRoles from './user/decorator/allowedRoles.decorator';
import { UserRole } from './user/dto/user.dto';
import { AppService } from './app.service';

@Controller()
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class AppProtectedController {
  private SETTINGS_KEY = 'settings';

  constructor(private app: AppService) {}

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
}
