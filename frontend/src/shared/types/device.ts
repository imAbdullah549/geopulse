export type Severity = "low" | "medium" | "high";

export type DeviceStatus = "online" | "offline" | "warning";

export type Device = {
  id: string;
  name: string;
  status: DeviceStatus;
  severity: Severity;
  lastSeenAt: string; // ISO string
  lat: number;
  lng: number;
};

export type DevicesQuery = {
  search?: string;
  status?: DeviceStatus | "all";
  severity?: Severity | "all";
  page?: number;
  pageSize?: number;
};

export type DevicesResponse = {
  results: Device[];
  count: number;
  page: number;
  pageSize: number;
};
