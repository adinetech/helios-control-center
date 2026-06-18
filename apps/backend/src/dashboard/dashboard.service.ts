import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const [farmsCount, usersCount, telemetryCount, latestTelemetry, farms] = await Promise.all([
      this.prisma.farm.count(),
      this.prisma.user.count(),
      this.prisma.telemetry.count(),
      this.prisma.telemetry.findFirst({
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.farm.findMany({ select: { id: true, status: true, capacityKw: true } }),
    ]);

    const activeFarms = farms.filter((f) => f.status === 'ONLINE').length;
    const warnings = farms.filter((f) => f.status === 'WARNING').length;
    const totalCapacity = farms.reduce((acc, farm) => acc + farm.capacityKw, 0);

    return {
      overview: {
        totalFarms: farmsCount,
        activeFarms,
        totalUsers: usersCount,
        warnings,
      },
      capacity: {
        totalKw: totalCapacity,
        currentOutputKw: latestTelemetry?.powerOutputKw || 0,
      },
      telemetry: {
        totalRecords: telemetryCount,
        latestUpdate: latestTelemetry?.timestamp || null,
      },
    };
  }
}
