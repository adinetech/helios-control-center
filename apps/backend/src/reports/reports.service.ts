import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getExecutiveSummary() {
    const farms = await this.prisma.farm.findMany({
      include: { telemetry: true },
    });

    let totalCapacityKw = 0;
    let totalProductionKwh = 0;
    let onlineFarms = 0;

    farms.forEach((farm) => {
      totalCapacityKw += farm.capacityKw;
      if (farm.status === 'ONLINE') onlineFarms++;

      if (farm.telemetry.length > 0) {
        // Take the latest telemetry total production or sum daily
        const latestTelemetry = farm.telemetry.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
        totalProductionKwh += latestTelemetry.totalProductionKwh || 0;
      }
    });

    const fleetUptime = farms.length > 0 ? (onlineFarms / farms.length) * 100 : 100;
    
    // Convert kWh to MWh
    const totalProductionMwh = totalProductionKwh / 1000;
    
    // Rough estimate: 1 MWh of solar saves approx 0.707 metric tons of CO2
    const co2OffsetTons = totalProductionMwh * 0.707;

    return {
      totalFarms: farms.length,
      totalCapacityMw: totalCapacityKw / 1000,
      totalProductionMwh,
      co2OffsetTons,
      fleetUptimePercent: fleetUptime,
      generatedAt: new Date().toISOString(),
    };
  }
}
