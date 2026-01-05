import { http, HttpResponse } from "msw";
import { devices } from "../data/devices.data";

import type {
  Device,
  DeviceHealth,
  DeviceStatus,
  DeviceType,
  DevicesSortField,
  Severity,
  SortOrder,
} from "@/shared/types/device";
import {
  healthRank,
  minutesSince,
  severityRank,
  statusRank,
} from "@/lib/deviceRules"; // keep your current path

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseIntSafe(value: string | null, fallback: number) {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseFloatSafe(value: string | null, fallback: number) {
  if (!value) return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function parseCsv<T extends string>(value: string | null): T[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean) as T[];
}

function parseEnum<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T
): T {
  if (!value) return fallback;
  return (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function safeTimeMs(iso?: string | null) {
  if (!iso) return 0;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : 0;
}

const ORDER_BY_FIELDS = [
  "name",
  "batteryPct",
  "severity",
  "health",
  "status",
  "lastPingAt",
  "lastDataAt",
] as const;

type OrderBy = (typeof ORDER_BY_FIELDS)[number];
type Order = "asc" | "desc";

function sortDevices(
  list: Device[],
  orderBy: DevicesSortField,
  order: SortOrder
) {
  const dir = order === "asc" ? 1 : -1;

  return list.sort((a, b) => {
    switch (orderBy) {
      case "name":
        return a.name.localeCompare(b.name) * dir;

      case "batteryPct": {
        const av = a.diagnostics.batteryPct ?? -1;
        const bv = b.diagnostics.batteryPct ?? -1;
        return (av - bv) * dir;
      }

      case "severity":
        return (severityRank(a.severity) - severityRank(b.severity)) * dir;

      case "health":
        return (
          (healthRank(a.diagnostics.health) -
            healthRank(b.diagnostics.health)) *
          dir
        );

      case "status":
        return (statusRank(a.status) - statusRank(b.status)) * dir;

      case "lastPingAt":
        return (
          (safeTimeMs(a.telemetry.lastPingAt) -
            safeTimeMs(b.telemetry.lastPingAt)) *
          dir
        );

      case "lastDataAt":
        return (
          (safeTimeMs(a.telemetry.lastDataAt) -
            safeTimeMs(b.telemetry.lastDataAt)) *
          dir
        );

      default:
        return 0;
    }
  });
}

export const devicesHandlers = [
  http.get("*/api/devices/summary", ({ request }) => {
    const url = new URL(request.url);

    // clamp to [0..1 year] in minutes (defensive + realistic)
    const staleMins = clamp(
      parseIntSafe(url.searchParams.get("staleMins"), 60),
      0,
      365 * 24 * 60
    );

    const total = devices.length;
    const byStatus = devices.reduce<Record<DeviceStatus, number>>(
      (acc, d) => {
        acc[d.status] = (acc[d.status] ?? 0) + 1;
        return acc;
      },
      { online: 0, offline: 0, degraded: 0, unknown: 0 }
    );

    const stale = devices.filter(
      (d) => minutesSince(d.telemetry.lastDataAt) >= staleMins
    ).length;

    return HttpResponse.json({
      total,
      byStatus,
      stale,
      staleMins,
    });
  }),

  http.get("*/api/devices", ({ request }) => {
    const url = new URL(request.url);

    const search = (url.searchParams.get("search") ?? "").trim().toLowerCase();

    // Multi-select filters (CSV in query)
    const type = parseCsv<DeviceType>(url.searchParams.get("type"));
    const status = parseCsv<DeviceStatus>(url.searchParams.get("status"));
    const severity = parseCsv<Severity>(url.searchParams.get("severity"));
    const health = parseCsv<DeviceHealth>(url.searchParams.get("health"));

    // Numeric filters (safe)
    const batteryMinRaw = parseFloatSafe(
      url.searchParams.get("batteryMin"),
      Number.NaN
    );
    const batteryMaxRaw = parseFloatSafe(
      url.searchParams.get("batteryMax"),
      Number.NaN
    );
    const staleMinsRaw = parseIntSafe(
      url.searchParams.get("staleMins"),
      Number.NaN as unknown as number
    );

    const hasBatteryMin = Number.isFinite(batteryMinRaw);
    const hasBatteryMax = Number.isFinite(batteryMaxRaw);

    const batteryMinClamped = hasBatteryMin
      ? clamp(batteryMinRaw, 0, 100)
      : undefined;
    const batteryMaxClamped = hasBatteryMax
      ? clamp(batteryMaxRaw, 0, 100)
      : undefined;

    const bMin =
      batteryMinClamped !== undefined && batteryMaxClamped !== undefined
        ? Math.min(batteryMinClamped, batteryMaxClamped)
        : batteryMinClamped;

    const bMax =
      batteryMinClamped !== undefined && batteryMaxClamped !== undefined
        ? Math.max(batteryMinClamped, batteryMaxClamped)
        : batteryMaxClamped;

    const staleMins = Number.isFinite(staleMinsRaw)
      ? clamp(staleMinsRaw, 0, 365 * 24 * 60)
      : undefined;

    // Sorting (validated)
    const orderBy = parseEnum<OrderBy>(
      url.searchParams.get("orderBy"),
      ORDER_BY_FIELDS,
      "lastPingAt"
    ) as DevicesSortField;

    const order = parseEnum<Order>(
      url.searchParams.get("order"),
      ["asc", "desc"] as const,
      "desc"
    ) as SortOrder;

    // Pagination (clamped)
    const page = clamp(
      parseIntSafe(url.searchParams.get("page"), 1),
      1,
      10_000
    );
    const pageSize = clamp(
      parseIntSafe(url.searchParams.get("pageSize"), 20),
      1,
      200
    );

    let filtered = [...devices];

    // Search across useful fields
    if (search) {
      filtered = filtered.filter((d) => {
        const hay = `${d.id} ${d.name} ${d.type} ${
          d.location.locationName ?? ""
        }`.toLowerCase();
        return hay.includes(search);
      });
    }

    if (type.length) filtered = filtered.filter((d) => type.includes(d.type));
    if (status.length)
      filtered = filtered.filter((d) => status.includes(d.status));
    if (severity.length)
      filtered = filtered.filter((d) => severity.includes(d.severity));
    if (health.length)
      filtered = filtered.filter((d) => health.includes(d.diagnostics.health));

    // Battery filters: require batteryPct to exist if filtering by battery
    if (bMin !== undefined) {
      filtered = filtered.filter((d) => {
        const v = d.diagnostics.batteryPct;
        return typeof v === "number" && v >= bMin;
      });
    }
    if (bMax !== undefined) {
      filtered = filtered.filter((d) => {
        const v = d.diagnostics.batteryPct;
        return typeof v === "number" && v <= bMax;
      });
    }

    // staleMins: keep only devices with lastData older than X minutes
    if (staleMins !== undefined) {
      filtered = filtered.filter(
        (d) => minutesSince(d.telemetry.lastDataAt) >= staleMins
      );
    }

    // Sort after filtering
    sortDevices(filtered, orderBy, order);

    const count = filtered.length;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ results, count, page, pageSize });
  }),

  http.get("*/api/devices/:id", ({ params }) => {
    const id = String(params.id);
    const found = devices.find((d) => d.id === id);

    if (!found) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(found);
  }),
];
