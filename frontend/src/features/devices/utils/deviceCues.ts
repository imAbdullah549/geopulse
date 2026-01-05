import type { Device } from "@/shared/types/device";
import {
  minutesSince,
  batteryLevel,
  healthLevel,
  staleLevel,
  statusLevel,
  type CueLevel,
} from "@/lib/deviceRules";

export function getDeviceCues(device: Device, staleThresholdMins: number) {
  const battery = device.diagnostics?.batteryPct;
  const staleMins = minutesSince(device.telemetry?.lastDataAt);
  const health = device.diagnostics?.health ?? "unknown";
  const status = device.status ?? "unknown";

  const batteryLvl = batteryLevel(battery);
  const staleLvl = staleLevel(staleMins, staleThresholdMins);
  const healthLvl = healthLevel(health);
  const statusLvl = statusLevel(status);

  const worst: CueLevel =
    statusLvl === "crit" ||
    healthLvl === "crit" ||
    staleLvl === "crit" ||
    batteryLvl === "crit"
      ? "crit"
      : statusLvl === "warn" ||
        healthLvl === "warn" ||
        staleLvl === "warn" ||
        batteryLvl === "warn"
      ? "warn"
      : "ok";

  return {
    battery,
    staleMins,
    health,
    status,
    batteryLvl,
    staleLvl,
    healthLvl,
    statusLvl,
    worst,
    hasAnyCue: worst !== "ok",
  };
}
