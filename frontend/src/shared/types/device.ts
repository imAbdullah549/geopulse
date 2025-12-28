export type DeviceStatus = "online" | "offline";
export type Severity = "low" | "medium" | "high";

export interface Device {
  id: string;
  name: string;
  type: string;
  status: DeviceStatus;
  severity: Severity;
  lastSeen: string;
  lat: number;
  lng: number;
}
