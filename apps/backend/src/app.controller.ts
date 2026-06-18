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
      
      // Try fetching right after insert to verify
      const prisma = (this.telemetryProvider as any).prisma;
      const count = await prisma.telemetry.count();
      const records = await prisma.telemetry.findMany({ take: 2 });
      const farms = await prisma.farm.findMany({ where: { status: 'ONLINE' } });

      return { 
        success: true, 
        countAfterInsert: count,
        farmsFound: farms.length,
        records: records 
      };
    } catch (e) {
      return { success: false, error: e.message, stack: e.stack };
    }
  }
}
