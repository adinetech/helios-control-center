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
exports.FarmsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FarmsService = class FarmsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.farm.findMany();
    }
    async remove(id) {
        return this.prisma.farm.delete({ where: { id } });
    }
    async getTelemetry(farmId, minutes = 60) {
        const since = new Date(Date.now() - minutes * 60000);
        return this.prisma.telemetry.findMany({
            where: { farmId, timestamp: { gte: since } },
            orderBy: { timestamp: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.farm.findUnique({ where: { id } });
    }
    async create(data) {
        return this.prisma.farm.create({ data });
    }
    async update(id, data) {
        return this.prisma.farm.update({ where: { id }, data });
    }
};
exports.FarmsService = FarmsService;
exports.FarmsService = FarmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FarmsService);
//# sourceMappingURL=farms.service.js.map