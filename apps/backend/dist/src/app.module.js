"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const schedule_1 = require("@nestjs/schedule");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const farms_module_1 = require("./farms/farms.module");
const health_module_1 = require("./health/health.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const telemetry_module_1 = require("./telemetry/telemetry.module");
const reports_module_1 = require("./reports/reports.module");
const tasks_module_1 = require("./tasks/tasks.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const http_metrics_interceptor_1 = require("./metrics/http-metrics.interceptor");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
                    transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
                },
            }),
            schedule_1.ScheduleModule.forRoot(),
            nestjs_prometheus_1.PrometheusModule.register({
                path: '/metrics',
                defaultMetrics: {
                    enabled: true,
                },
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            farms_module_1.FarmsModule,
            health_module_1.HealthModule,
            dashboard_module_1.DashboardModule,
            telemetry_module_1.TelemetryModule,
            reports_module_1.ReportsModule,
            tasks_module_1.TasksModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            (0, nestjs_prometheus_1.makeHistogramProvider)({
                name: 'http_requests_duration_seconds',
                help: 'HTTP request duration in seconds',
                labelNames: ['method', 'route', 'status_code'],
            }),
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: http_metrics_interceptor_1.HttpMetricsInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map