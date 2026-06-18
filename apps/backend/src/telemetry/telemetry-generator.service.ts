import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelemetryGeneratorService {
  private readonly logger = new Logger(TelemetryGeneratorService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('*/5 * * * * *') // Run every 5 seconds for faster testing/demo
  async generateTelemetry() {
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
        this.logger.warn(`Farm ${farm.name} is experiencing anomalous conditions! Temp: ${temperatureC.toFixed(2)}C`);
        // Maybe update farm status if we wanted to
      }

      // Power Output based on capacity and irradiance
      // Efficiency decreases slightly as temperature rises above 25C
      const efficiencyLoss = Math.max(0, (temperatureC - 25) * 0.004);
      const powerOutputKw = (farm.capacityKw * (irradiance / 1000)) * (1 - efficiencyLoss);

      await this.prisma.telemetry.create({
        data: {
          farmId: farm.id,
          powerOutputKw: Math.max(0, powerOutputKw),
          temperatureC,
          irradiance,
        },
      });
    }
  }
}
