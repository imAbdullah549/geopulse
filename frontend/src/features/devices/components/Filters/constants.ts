import type {
  DeviceHealth,
  DeviceStatus,
  DeviceType,
  DevicesSortField,
  Severity,
} from "@/shared/types/device";

export const ALL_TYPES: DeviceType[] = [
  "camera",
  "weather_sensor",
  "road_sensor",
  "air_sensor",
];

export const ALL_STATUS: DeviceStatus[] = [
  "online",
  "offline",
  "degraded",
  "unknown",
];

export const ALL_HEALTH: DeviceHealth[] = ["good", "fair", "poor", "critical"];

export const ALL_SEVERITY: Severity[] = ["low", "medium", "high"];

export const SORT_LABEL: Record<DevicesSortField, string> = {
  name: "Name",
  severity: "Priority",
  status: "Status",
  health: "Health",
  batteryPct: "Battery",
  lastPingAt: "Last ping",
  lastDataAt: "Last data",
};
