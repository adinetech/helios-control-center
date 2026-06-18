"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map