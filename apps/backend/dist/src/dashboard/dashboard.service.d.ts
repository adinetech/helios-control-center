import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    }>;
}
