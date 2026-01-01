export type Severity = "low" | "medium" | "high";
export type AlertStatus = "open" | "acknowledged" | "resolved";

export interface MapPointDto {
  id: string;
  title: string;
  severity: Severity;
  status: AlertStatus;

  lat: number;
  lng: number;

  deviceId?: string;
  deviceName?: string;

  timestamp: string; // ISO string
}

export interface MapPointsParams {
  severities?: Severity[];
  year?: number;
  onlyActive?: boolean;
}
