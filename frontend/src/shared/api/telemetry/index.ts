import { devicesTelemetryAllowlist } from "@/features/devices/telemetry/queryAllowlist";

export const PARAM_ALLOWLIST_BY_ENDPOINT: Record<string, Set<string>> = {
  ...devicesTelemetryAllowlist,
};
