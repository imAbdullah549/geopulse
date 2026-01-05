import type { DevicesQuery } from "@/shared/types/device";

type DevicesQueryKey = Exclude<keyof DevicesQuery, "search">;

const getDevicesKeys = [
  "page",
  "pageSize",
  "orderBy",
  "order",
  "type",
  "status",
  "severity",
  "health",
  "batteryMin",
  "batteryMax",
  "staleMins",
] as const satisfies readonly DevicesQueryKey[];

type DevicesSummaryQuery = { staleMins?: number };
type DevicesSummaryQueryKey = keyof DevicesSummaryQuery;

const getDevicesSummaryKeys = [
  "staleMins",
] as const satisfies readonly DevicesSummaryQueryKey[];

export const devicesTelemetryAllowlist = {
  getDevices: new Set<DevicesQueryKey>(getDevicesKeys),
  getDevicesSummary: new Set<DevicesSummaryQueryKey>(getDevicesSummaryKeys),
} as const;
