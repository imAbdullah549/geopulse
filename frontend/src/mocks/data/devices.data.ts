import type { Device, DeviceStatus, Severity } from "@/shared/types/device";

const statuses: DeviceStatus[] = ["online", "offline", "warning"];
const severities: Severity[] = ["low", "medium", "high"];

export const devices: Device[] = Array.from({ length: 120 }, (_, i) => {
  const idx = i + 1;
  return {
    id: `dev-${idx}`,
    name: `Device ${idx}`,
    status: statuses[i % statuses.length],
    severity: severities[i % severities.length],
    lastSeenAt: new Date(Date.now() - i * 2 * 60_000).toISOString(),
    lat: 60.1699 + (i % 20) * 0.002,
    lng: 24.9384 + (i % 20) * 0.003,
  };
});
