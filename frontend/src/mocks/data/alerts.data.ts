import type { Alert } from "@/shared/types/alert";

export const alerts: Alert[] = Array.from({ length: 80 }, (_, i) => ({
  id: `al-${i + 1}`,
  deviceId: `dev-${(i % 50) + 1}`,
  title: i % 3 === 0 ? "Battery low" : "Temperature high",
  severity: i % 7 === 0 ? "high" : i % 3 === 0 ? "medium" : "low",
  status: i % 6 === 0 ? "acknowledged" : "open",
  createdAt: new Date(Date.now() - i * 5 * 60_000).toISOString(),
}));
