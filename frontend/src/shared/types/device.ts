export type Severity = "low" | "medium" | "high";

export type DeviceStatus = "online" | "offline" | "degraded" | "unknown";

export type DeviceType =
  | "camera"
  | "weather_sensor"
  | "road_sensor"
  | "air_sensor";

export type DeviceHealth = "good" | "fair" | "poor" | "critical";

export type StreamStatus = "ok" | "frozen" | "no_signal";

export type CameraIncident = "none" | "congestion" | "stopped_vehicle";

export type DevicesSummaryByStatus = Record<DeviceStatus, number>;

export type GeoPoint = {
  lat: number;
  lng: number;
  /** GPS accuracy / confidence for the position */
  accuracyMeters?: number;
  /** Human label like "Zone 2" or "Helsinki Center" */
  locationName?: string;
};

export type DeviceTelemetry = {
  /** Connectivity/heartbeat timestamp */
  lastPingAt: string; // ISO
  /** Last valid reading timestamp (freshness of data) */
  lastDataAt: string; // ISO
};

export type DeviceDiagnostics = {
  batteryPct?: number; // 0..100
  signalDbm?: number; // -50 strong ... -110 weak
  health: DeviceHealth;
};

export type CameraReadings = {
  streamStatus: StreamStatus;
  fps?: number;
  vehicleCount1m?: number;
  incident: CameraIncident;
};

export type WeatherReadings = {
  temperatureC?: number;
  visibilityM?: number;
  fogIndex?: number; // 0..1
  snowMmH?: number;
};

export type RoadReadings = {
  friction?: number; // 0..1
  wetness?: number; // 0..1
  iceProbability?: number; // 0..1
};

export type AirReadings = {
  aqi?: number; // 0..500
  pm25?: number; // µg/m3
};

export type DeviceReadings =
  | { kind: "camera"; data: CameraReadings }
  | { kind: "weather_sensor"; data: WeatherReadings }
  | { kind: "road_sensor"; data: RoadReadings }
  | { kind: "air_sensor"; data: AirReadings };

export type Device = {
  id: string;
  name: string;
  type: DeviceType;

  status: DeviceStatus;
  /** Overall risk/priority derived from alerting/health rules */
  severity: Severity;

  location: GeoPoint;

  telemetry: DeviceTelemetry;
  diagnostics: DeviceDiagnostics;

  /** Present for detail views; list endpoints may still return it (mock ok). */
  readings: DeviceReadings;
};

export type DeviceListItem = Device;

export type DevicesSortField =
  | "name"
  | "severity"
  | "status"
  | "health"
  | "batteryPct"
  | "lastPingAt"
  | "lastDataAt";

export type SortOrder = "asc" | "desc";

export type DevicesQuery = {
  search?: string;

  /** Multi-select filters */
  type?: DeviceType[]; // e.g. ["camera","weather_sensor"]
  status?: DeviceStatus[];
  severity?: Severity[];
  health?: DeviceHealth[];

  /** Numeric filters */
  batteryMin?: number;
  batteryMax?: number;

  /**
   * Show devices whose lastDataAt is older than this threshold (minutes).
   * Useful for "stale telemetry" monitoring.
   */
  staleMins?: number;

  /** Sorting */
  orderBy?: DevicesSortField;
  order?: SortOrder;

  page?: number;
  pageSize?: number;
};

export type DevicesResponse = {
  results: DeviceListItem[];
  count: number;
  page: number;
  pageSize: number;
};

export type DevicesSummaryResponse = {
  total: number;
  byStatus: DevicesSummaryByStatus;
  stale: number;
  staleMins: number;
};
