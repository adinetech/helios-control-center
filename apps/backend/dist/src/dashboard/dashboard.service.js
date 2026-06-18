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
    async getPrimaryFarmId() {
        const farm = await this.prisma.farm.findFirst({
            orderBy: { capacityKw: 'asc' },
        });
        return farm?.id;
    }
    async getSummary() {
        const primaryFarmId = await this.getPrimaryFarmId();
        const [farmsCount, usersCount, telemetryCount, latestTelemetry, farms] = await Promise.all([
            this.prisma.farm.count(),
            this.prisma.user.count(),
            this.prisma.telemetry.count(),
            this.prisma.telemetry.findFirst({
                where: primaryFarmId ? { farmId: primaryFarmId } : undefined,
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
            extended: {
                pv1PowerKw: latestTelemetry?.pv1PowerKw || 0,
                pv2PowerKw: latestTelemetry?.pv2PowerKw || 0,
                totalPvPowerKw: latestTelemetry?.totalPvPowerKw || latestTelemetry?.pv1PowerKw || 0,
                batterySoc: latestTelemetry?.batterySoc || 0,
                batteryVoltage: latestTelemetry?.batteryVoltage || 0,
                batteryPowerKw: latestTelemetry?.batteryPowerKw || 0,
                gridPowerKw: latestTelemetry?.gridPowerKw || 0,
                loadPowerKw: latestTelemetry?.loadPowerKw || 0,
                dailyProductionKwh: latestTelemetry?.dailyProductionKwh || 0,
                totalProductionKwh: latestTelemetry?.totalProductionKwh || 0,
                temperatureC: latestTelemetry?.temperatureC || 0,
            }
        };
    }
    async getHistory(minutes = 60) {
        const primaryFarmId = await this.getPrimaryFarmId();
        const since = new Date(Date.now() - minutes * 60000);
        const telemetry = await this.prisma.telemetry.findMany({
            where: {
                timestamp: { gte: since },
                ...(primaryFarmId ? { farmId: primaryFarmId } : {}),
            },
            orderBy: { timestamp: 'asc' },
        });
        const grouped = telemetry.reduce((acc, curr) => {
            const timeMs = Math.floor(curr.timestamp.getTime() / 30000) * 30000;
            const key = timeMs.toString();
            if (!acc[key]) {
                acc[key] = {
                    timestamp: new Date(timeMs).toISOString(),
                    powerOutputKw: 0,
                    temperatureC: 0,
                    irradiance: 0,
                    pv1PowerKw: 0,
                    pv2PowerKw: 0,
                    totalPvPowerKw: 0,
                    batterySoc: 0,
                    batteryPowerKw: 0,
                    batteryVoltage: 0,
                    gridPowerKw: 0,
                    loadPowerKw: 0,
                    dailyProductionKwh: 0,
                    totalProductionKwh: 0,
                    count: 0,
                };
            }
            const b = acc[key];
            b.powerOutputKw += curr.powerOutputKw;
            b.temperatureC += curr.temperatureC;
            b.irradiance += curr.irradiance;
            b.pv1PowerKw += curr.pv1PowerKw || 0;
            b.pv2PowerKw += curr.pv2PowerKw || 0;
            b.totalPvPowerKw += curr.totalPvPowerKw || curr.pv1PowerKw || 0;
            b.batterySoc += curr.batterySoc || 0;
            b.batteryPowerKw += curr.batteryPowerKw || 0;
            b.batteryVoltage += curr.batteryVoltage || 0;
            b.gridPowerKw += curr.gridPowerKw || 0;
            b.loadPowerKw += curr.loadPowerKw || 0;
            b.dailyProductionKwh += curr.dailyProductionKwh || 0;
            b.totalProductionKwh += curr.totalProductionKwh || 0;
            b.count += 1;
            return acc;
        }, {});
        return Object.values(grouped)
            .map((v) => ({
            timestamp: v.timestamp,
            powerOutputKw: v.powerOutputKw / v.count,
            temperatureC: v.temperatureC / v.count,
            irradiance: v.irradiance / v.count,
            pv1PowerKw: v.pv1PowerKw / v.count,
            pv2PowerKw: v.pv2PowerKw / v.count,
            totalPvPowerKw: v.totalPvPowerKw / v.count,
            batterySoc: v.batterySoc / v.count,
            batteryPowerKw: v.batteryPowerKw / v.count,
            batteryVoltage: v.batteryVoltage / v.count,
            gridPowerKw: v.gridPowerKw / v.count,
            loadPowerKw: v.loadPowerKw / v.count,
            dailyProductionKwh: v.dailyProductionKwh / v.count,
            totalProductionKwh: v.totalProductionKwh / v.count,
        }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map