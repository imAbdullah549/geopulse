import type {
  DeviceHealth,
  DeviceStatus,
  Severity,
} from "@/shared/types/device";

export type CueLevel = "ok" | "warn" | "crit";

export const BATTERY_WARN_PCT = 25;
export const BATTERY_CRIT_PCT = 10;

export function batteryLevel(pct?: number | null): CueLevel {
  if (typeof pct !== "number") return "warn";
  if (pct < BATTERY_CRIT_PCT) return "crit";
  if (pct < BATTERY_WARN_PCT) return "warn";
  return "ok";
}

export function healthLevel(
  health: DeviceHealth | string | null | undefined
): CueLevel {
  const r = healthRank(health);
  if (r <= 0) return "ok"; // good
  if (r === 1) return "warn"; // fair
  return "crit"; // poor/critical/unknown
}

export function statusLevel(
  status: DeviceStatus | string | null | undefined
): CueLevel {
  if (!status) return "crit";
  if (status === "online") return "ok";
  if (status === "degraded") return "warn";
  return "crit"; // offline/unknown
}

export function staleLevel(staleMins: number, thresholdMins: number): CueLevel {
  if (!Number.isFinite(staleMins)) return "crit";
  if (staleMins < thresholdMins) return "ok";
  if (staleMins < thresholdMins * 3) return "warn";
  return "crit";
}

export function minutesSince(iso?: string | null): number {
  if (!iso) return Infinity;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return Infinity;
  return Math.floor((Date.now() - t) / 60_000);
}

const HEALTH_RANK: Record<DeviceHealth, number> = {
  good: 0,
  fair: 1,
  poor: 2,
  critical: 3,
};

export function healthRank(
  health: DeviceHealth | string | null | undefined
): number {
  if (!health) return 4;
  return (HEALTH_RANK as Record<string, number>)[health] ?? 4;
}

const STATUS_RANK: Record<DeviceStatus, number> = {
  online: 0,
  degraded: 1,
  offline: 2,
  unknown: 3,
};

export function statusRank(
  status: DeviceStatus | string | null | undefined
): number {
  if (!status) return 4;
  return (STATUS_RANK as Record<string, number>)[status] ?? 4;
}

const SEVERITY_RANK: Record<Severity, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export function severityRank(
  severity: Severity | string | null | undefined
): number {
  if (!severity) return 3;
  return (SEVERITY_RANK as Record<string, number>)[severity] ?? 3;
}
