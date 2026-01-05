// src/mocks/data/devices.data.ts

import type {
  Device,
  DeviceHealth,
  DeviceReadings,
  DeviceStatus,
  DeviceType,
  Severity,
} from "@/shared/types/device";

const deviceTypes: DeviceType[] = [
  "camera",
  "weather_sensor",
  "road_sensor",
  "air_sensor",
];

const statuses: DeviceStatus[] = ["online", "offline", "degraded", "unknown"];
const severities: Severity[] = ["low", "medium", "high"];
const healths: DeviceHealth[] = ["good", "fair", "poor", "critical"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rnd(seed: number) {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

function isoMinutesAgo(mins: number) {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

export const devices: Device[] = Array.from({ length: 160 }, (_, i) => {
  const idx = i + 1;

  const type = deviceTypes[idx % deviceTypes.length];
  const status = statuses[idx % statuses.length];
  const severity = severities[idx % severities.length];

  const pingAgeMins = status === "online" ? idx % 25 : 60 + (idx % 240);
  const dataAgeMins = status === "online" ? idx % 35 : 90 + (idx % 480);

  const batteryBase = 95 - (idx % 90);
  const batteryPct =
    status === "offline"
      ? clamp(batteryBase - 15, 0, 100)
      : clamp(batteryBase, 0, 100);

  const signalDbm = -50 - Math.floor(rnd(idx) * 55);

  const healthOffset =
    status === "offline" || status === "unknown"
      ? 2
      : status === "degraded"
      ? 1
      : 0;

  const health = healths[(idx + healthOffset) % healths.length];

  const lat = 60.1699 + (idx % 24) * 0.002;
  const lng = 24.9384 + (idx % 28) * 0.003;

  const location = {
    lat,
    lng,
    accuracyMeters: 3 + (idx % 12),
    locationName: `Zone ${((idx % 6) + 1).toString()}`,
  };

  const telemetry = {
    lastPingAt: isoMinutesAgo(pingAgeMins),
    lastDataAt: isoMinutesAgo(dataAgeMins),
  };

  const diagnostics = {
    batteryPct,
    signalDbm,
    health,
  };

  // ✅ KEY FIX: force readings to be DeviceReadings so literals stay narrow
  const readings: DeviceReadings =
    type === "camera"
      ? {
          kind: "camera",
          data: {
            streamStatus:
              status === "online"
                ? "ok"
                : status === "degraded"
                ? "frozen"
                : "no_signal",
            fps:
              status === "online" ? 24 : status === "degraded" ? 6 : undefined,
            vehicleCount1m:
              status === "online" ? Math.floor(rnd(idx + 3) * 45) : undefined,
            incident:
              severity === "high" && status === "online"
                ? rnd(idx + 4) > 0.5
                  ? "congestion"
                  : "stopped_vehicle"
                : "none",
          },
        }
      : type === "weather_sensor"
      ? {
          kind: "weather_sensor",
          data: {
            temperatureC:
              Math.round((-15 + rnd(idx) * 45 + Number.EPSILON) * 10) / 10,
            visibilityM: Math.floor(150 + rnd(idx + 5) * 2200),
            fogIndex: Math.round(rnd(idx + 6) * 100) / 100,
            snowMmH: Math.round(rnd(idx + 7) * 7 * 10) / 10,
          },
        }
      : type === "road_sensor"
      ? {
          kind: "road_sensor",
          data: {
            friction: Math.round((0.25 + rnd(idx + 8) * 0.75) * 100) / 100,
            wetness: Math.round(rnd(idx + 9) * 100) / 100,
            iceProbability: Math.round(rnd(idx + 10) * 100) / 100,
          },
        }
      : {
          kind: "air_sensor",
          data: {
            aqi: Math.floor(15 + rnd(idx + 11) * 220),
            pm25: Math.round((2 + rnd(idx + 12) * 55) * 10) / 10,
          },
        };

  return {
    id: `dev-${idx}`,
    name: `${type.replace("_", " ")} ${idx}`,
    type,
    status,
    severity,
    location,
    telemetry,
    diagnostics,
    readings,
  };
});
