import type { Severity } from "./device";

export type AlertStatus = "open" | "acknowledged" | "resolved";

export interface Alert {
  id: string;
  deviceId: string;
  title: string;
  severity: Severity;
  status: AlertStatus;
  createdAt: string; // ISO timestamp
}
