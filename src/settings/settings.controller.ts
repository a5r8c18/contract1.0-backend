/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// SettingsController.ts

import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from 'src/jwt/jwt-auth.guard';

@Controller(process.env.API_SETTINGS_PREFIX || 'settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSettings(@Req() req: any): Promise<any> {
    return this.settingsService.getSettings(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateSettings(@Req() req: any, @Body() updateData: any): Promise<any> {
    return this.settingsService.updateSettings(req.user.sub, updateData);
  }
}
