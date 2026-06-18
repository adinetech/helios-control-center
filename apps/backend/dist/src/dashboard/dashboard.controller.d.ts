import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
