export type Severity = "low" | "medium" | "high";
export type DeviceStatus = "online" | "offline" | "warning";
export type AlertStatus = "open" | "acknowledged" | "resolved";

export const tagStyles = {
  severity: {
    low: "bg-muted text-muted-foreground border-border",
    medium: "bg-amber-50 text-amber-700 border-amber-200",
    high: "bg-red-50 text-red-700 border-red-200",
  } satisfies Record<Severity, string>,

  deviceStatus: {
    online: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    offline: "bg-muted text-muted-foreground border-border",
  } satisfies Record<DeviceStatus, string>,

  alertStatus: {
    open: "bg-blue-50 text-blue-700 border-blue-200",
    acknowledged: "bg-muted text-muted-foreground border-border",
    resolved: "bg-green-50 text-green-700 border-green-200",
  } satisfies Record<AlertStatus, string>,
};
