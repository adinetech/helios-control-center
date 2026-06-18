import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelemetryProvider } from './telemetry.provider';

@Injectable()
export class SimulatorTelemetryProvider implements TelemetryProvider {
  private readonly logger = new Logger(SimulatorTelemetryProvider.name);

  constructor(private readonly prisma: PrismaService) {}

  async processTelemetry(): Promise<void> {
    const farms = await this.prisma.farm.findMany({ where: { status: 'ONLINE' } });
    if (farms.length === 0) return;

    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60; // 0 to 24

    for (const farm of farms) {
      // Simulate sunrise (6am) to sunset (6pm) using sine wave
      let irradiance = 0;
      if (hour >= 6 && hour <= 18) {
        // Map 6-18 to 0-PI
        const timeMapped = ((hour - 6) / 12) * Math.PI;
        irradiance = Math.sin(timeMapped) * 1000; // Peak 1000 W/m^2
        
        // Add cloud cover fluctuations (-150 to +50)
        irradiance += (Math.random() * 200) - 150;
        if (irradiance < 0) irradiance = 0;
      } else {
        // Nighttime noise
        irradiance = Math.random() * 5;
      }

      // Base temp 15C, peaks at 35C in the afternoon
      let temperatureC = 15 + Math.sin(((hour - 4) / 20) * Math.PI) * 20 + (Math.random() * 2);

      // Random warning condition
      const isWarning = Math.random() < 0.05; // 5% chance
      if (isWarning) {
        temperatureC += 10; // Overheating
      }

      // Power Output based on capacity and irradiance
      const efficiencyLoss = Math.max(0, (temperatureC - 25) * 0.004);
      const powerOutputKw = (farm.capacityKw * (irradiance / 1000)) * (1 - efficiencyLoss);

      // Simulate some realistic hybrid inverter metrics for the simulator mode too
      // so the dashboard looks good even in simulator mode
      const pv1PowerKw = powerOutputKw * 0.6;
      const pv2PowerKw = powerOutputKw * 0.4;
      const loadPowerKw = 0.5 + Math.random() * 0.5; // 500W to 1kW base load
      const batterySoc = 50 + Math.sin(hour / 24 * Math.PI * 2) * 30; // Swings from 20 to 80
      const gridPowerKw = powerOutputKw > loadPowerKw ? -(powerOutputKw - loadPowerKw) : (loadPowerKw - powerOutputKw);

      await this.prisma.telemetry.create({
        data: {
          farmId: farm.id,
          powerOutputKw: Math.max(0, powerOutputKw),
          temperatureC,
          irradiance,
          pv1PowerKw,
          pv2PowerKw,
          totalPvPowerKw: powerOutputKw,
          batterySoc: Math.max(0, Math.min(100, batterySoc)),
          batteryVoltage: 24.5 + Math.random(),
          batteryPowerKw: powerOutputKw > loadPowerKw ? powerOutputKw - loadPowerKw : loadPowerKw - powerOutputKw,
          gridPowerKw,
          loadPowerKw,
        },
      });
    }
  }
}
