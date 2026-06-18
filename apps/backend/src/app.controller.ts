import { Controller, Get, Post, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import type { TelemetryProvider } from './telemetry/telemetry.provider';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('TELEMETRY_PROVIDER') private readonly telemetryProvider: TelemetryProvider
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('trigger')
  async triggerTelemetry() {
    try {
      await this.telemetryProvider.processTelemetry();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message, stack: e.stack };
    }
  }
}
