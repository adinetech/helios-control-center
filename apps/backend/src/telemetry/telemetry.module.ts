import { Module } from '@nestjs/common';
import { TelemetryGeneratorService } from './telemetry-generator.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [PrismaModule, LoggerModule],
  providers: [TelemetryGeneratorService],
})
export class TelemetryModule {}
