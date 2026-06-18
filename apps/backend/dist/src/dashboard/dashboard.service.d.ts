import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private getPrimaryFarmId;
    getSummary(): Promise<{
        overview: {
            totalFarms: number;
            activeFarms: number;
            totalUsers: number;
            warnings: number;
        };
        capacity: {
            totalKw: number;
            currentOutputKw: number;
        };
        telemetry: {
            totalRecords: number;
            latestUpdate: Date | null;
        };
        extended: {
            pv1PowerKw: any;
            pv2PowerKw: any;
            totalPvPowerKw: any;
            batterySoc: any;
            batteryVoltage: any;
            batteryPowerKw: any;
            gridPowerKw: any;
            loadPowerKw: any;
            dailyProductionKwh: any;
            totalProductionKwh: any;
            temperatureC: number;
        };
    }>;
    getHistory(minutes?: number): Promise<{
        timestamp: any;
        powerOutputKw: number;
        temperatureC: number;
        irradiance: number;
        pv1PowerKw: number;
        pv2PowerKw: number;
        totalPvPowerKw: number;
        batterySoc: number;
        batteryPowerKw: number;
        batteryVoltage: number;
        gridPowerKw: number;
        loadPowerKw: number;
        dailyProductionKwh: number;
        totalProductionKwh: number;
    }[]>;
}
