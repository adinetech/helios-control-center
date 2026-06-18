import { Injectable, Inject, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { TelemetryProvider } from './telemetry.provider';

@Injectable()
export class TelemetryCronService {
  private readonly logger = new Logger(TelemetryCronService.name);

  constructor(
    @Inject('TELEMETRY_PROVIDER')
    private readonly provider: TelemetryProvider,
  ) {}

  @Cron('*/5 * * * * *') // Run every 5 seconds
  async handleCron() {
    try {
      await this.provider.processTelemetry();
    } catch (e) {
      this.logger.error(`Error processing telemetry: ${e.message}`, e.stack);
    }
  }
}
