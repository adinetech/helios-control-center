"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const nestjs_pino_1 = require("nestjs-pino");
const simulator_provider_1 = require("./simulator.provider");
const deye_provider_1 = require("./deye.provider");
const telemetry_cron_service_1 = require("./telemetry-cron.service");
const prisma_service_1 = require("../prisma/prisma.service");
let TelemetryModule = class TelemetryModule {
};
exports.TelemetryModule = TelemetryModule;
exports.TelemetryModule = TelemetryModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, nestjs_pino_1.LoggerModule],
        providers: [
            simulator_provider_1.SimulatorTelemetryProvider,
            deye_provider_1.DeyeTelemetryProvider,
            {
                provide: 'TELEMETRY_PROVIDER',
                useFactory: (prisma, simulator, deye) => {
                    const provider = process.env.TELEMETRY_PROVIDER;
                    if (provider === 'deye') {
                        return deye;
                    }
                    return simulator;
                },
                inject: [prisma_service_1.PrismaService, simulator_provider_1.SimulatorTelemetryProvider, deye_provider_1.DeyeTelemetryProvider],
            },
            telemetry_cron_service_1.TelemetryCronService,
        ],
    })
], TelemetryModule);
//# sourceMappingURL=telemetry.module.js.map