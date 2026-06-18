import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelemetryProvider } from './telemetry.provider';
import { Gauge, register } from 'prom-client';
import axios from 'axios';

@Injectable()
export class DeyeTelemetryProvider implements TelemetryProvider {
  private readonly logger = new Logger(DeyeTelemetryProvider.name);
  private readonly exporterUrl = process.env.DEYE_EXPORTER_URL || 'http://localhost:9105/metrics';
  private readonly gauges = new Map<string, Gauge<string>>();

  constructor(private readonly prisma: PrismaService) {}

  async processTelemetry(): Promise<void> {
    // Only use the primary farm (smallest capacityKw = home installation).
    // The Deye inverter is a single device; inserting into all farms would triple-count data.
    const primaryFarm = await this.prisma.farm.findFirst({
      where: { status: 'ONLINE' },
      orderBy: { capacityKw: 'asc' },
    });
    if (!primaryFarm) return;
    const farms = [primaryFarm];

    try {
      const response = await axios.get(this.exporterUrl, { timeout: 10000 });
      
      const metricsText = response.data;
      const parsedData = this.parseMetrics(metricsText);
      
      for (const farm of farms) {
        // Map Deye metrics to our internal model
        // NOTE: Deye exporter reports pv1_power, pv2_power in Watts.
        // battery_power, load_power, grid_power are also in Watts — divide by 1000 for kW.
        const pv1PowerKw = (parsedData.get('deye_pv1_power') || 0) / 1000;
        const pv2PowerKw = (parsedData.get('deye_pv2_power') || 0) / 1000;
        const totalPvPowerKw = pv1PowerKw + pv2PowerKw;

        // load_power / grid_power / battery_power are all in Watts from Deye exporter
        const loadPowerKw = (parsedData.get('deye_total_load_power') || 0) / 1000;
        // grid_power: positive = importing, negative = exporting (Deye convention)
        const gridPowerKw = (parsedData.get('deye_total_grid_power') || 0) / 1000;
        // battery_power: positive = discharging, negative = charging
        const batteryPowerKw = (parsedData.get('deye_battery_power') || 0) / 1000;

        const batterySoc = parsedData.get('deye_battery_soc') ?? null;
        const batteryVoltage = parsedData.get('deye_battery_voltage') ?? null;

        const dailyProductionKwh = parsedData.get('deye_daily_production') ?? null;
        const totalProductionKwh = parsedData.get('deye_total_production') ?? null;
        // Deye exposes dc_temperature; fall back to battery_temperature if missing
        const temperatureC = parsedData.get('deye_dc_temperature') ?? parsedData.get('deye_battery_temperature') ?? 0;

        await this.prisma.telemetry.create({
          data: {
            farmId: farm.id,
            // Core required fields mapped
            powerOutputKw: totalPvPowerKw,
            temperatureC: temperatureC,
            irradiance: 0, // Not provided directly by Deye in W/m2, keeping 0

            // Extended Hybrid fields
            pv1PowerKw,
            pv2PowerKw,
            totalPvPowerKw,
            batterySoc,
            batteryVoltage,
            batteryPowerKw,
            gridPowerKw,
            loadPowerKw,
            dailyProductionKwh,
            totalProductionKwh,
          },
        });
      }
    } catch (error) {
      this.logger.error(`Error polling Deye telemetry: ${error.message}`);
      // Gracefully exit without crashing
    }
  }

  private parseMetrics(text: string): Map<string, number> {
    const metrics = new Map<string, number>();
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (!line || line.startsWith('#')) continue;
      
      const match = line.match(/^([a-zA-Z0-9_]+)(?:\{[^}]+\})?\s+([0-9.eE+-]+)/);
      if (match) {
        const key = match[1];
        const value = parseFloat(match[2]);
        if (!isNaN(value)) {
          metrics.set(key, value);
          
          // Dynamically update Prometheus gauge
          if (!this.gauges.has(key)) {
            try {
              const gauge = new Gauge({
                name: key,
                help: `Deye exported metric ${key}`,
                registers: [register],
              });
              this.gauges.set(key, gauge);
            } catch (e) {
              // If it was already registered elsewhere, retrieve it
              const existingMetric = register.getSingleMetric(key);
              if (existingMetric && existingMetric instanceof Gauge) {
                 this.gauges.set(key, existingMetric as Gauge<string>);
              }
            }
          }
          
          const gauge = this.gauges.get(key);
          if (gauge) {
            gauge.set(value);
          }
        }
      }
    }
    return metrics;
  }
}
