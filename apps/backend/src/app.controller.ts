import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TelemetryCronService } from './telemetry/telemetry-cron.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly telemetryCron: TelemetryCronService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('trigger')
  async triggerTelemetry() {
    await this.telemetryCron.handleCron();
    return { success: true };
  }
}
