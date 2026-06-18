export interface TelemetryProvider {
  /**
   * Generates or fetches telemetry for the active solar farms.
   * Called periodically by the Telemetry Cron service.
   */
  processTelemetry(): Promise<void>;
}
