import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';
import { SimulatorTelemetryProvider } from './simulator.provider';
import { DeyeTelemetryProvider } from './deye.provider';
import { TelemetryCronService } from './telemetry-cron.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [
    SimulatorTelemetryProvider,
    DeyeTelemetryProvider,
    {
      provide: 'TELEMETRY_PROVIDER',
      useFactory: (
        prisma: PrismaService,
        simulator: SimulatorTelemetryProvider,
        deye: DeyeTelemetryProvider,
      ) => {
        const provider = process.env.TELEMETRY_PROVIDER;
        if (provider === 'deye') {
          return deye;
        }
        return simulator;
      },
      inject: [PrismaService, SimulatorTelemetryProvider, DeyeTelemetryProvider],
    },
    TelemetryCronService,
  ],
})
export class TelemetryModule {}

