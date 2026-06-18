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
var TelemetryGeneratorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryGeneratorService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let TelemetryGeneratorService = TelemetryGeneratorService_1 = class TelemetryGeneratorService {
    prisma;
    logger = new common_1.Logger(TelemetryGeneratorService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateTelemetry() {
        const farms = await this.prisma.farm.findMany({ where: { status: 'ONLINE' } });
        if (farms.length === 0)
            return;
        const now = new Date();
        const hour = now.getHours() + now.getMinutes() / 60;
        for (const farm of farms) {
            let irradiance = 0;
            if (hour >= 6 && hour <= 18) {
                const timeMapped = ((hour - 6) / 12) * Math.PI;
                irradiance = Math.sin(timeMapped) * 1000;
                irradiance += (Math.random() * 200) - 150;
                if (irradiance < 0)
                    irradiance = 0;
            }
            else {
                irradiance = Math.random() * 5;
            }
            let temperatureC = 15 + Math.sin(((hour - 4) / 20) * Math.PI) * 20 + (Math.random() * 2);
            const isWarning = Math.random() < 0.05;
            if (isWarning) {
                temperatureC += 10;
                this.logger.warn(`Farm ${farm.name} is experiencing anomalous conditions! Temp: ${temperatureC.toFixed(2)}C`);
            }
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
};
exports.TelemetryGeneratorService = TelemetryGeneratorService;
__decorate([
    (0, schedule_1.Cron)('*/5 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TelemetryGeneratorService.prototype, "generateTelemetry", null);
exports.TelemetryGeneratorService = TelemetryGeneratorService = TelemetryGeneratorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TelemetryGeneratorService);
//# sourceMappingURL=telemetry-generator.service.js.map