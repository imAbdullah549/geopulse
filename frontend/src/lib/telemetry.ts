const enabled =
  String(import.meta.env.VITE_TELEMETRY_ENABLED ?? "false").toLowerCase() ===
  "true";

const consoleEnabled =
  String(import.meta.env.VITE_TELEMETRY_CONSOLE ?? "false").toLowerCase() ===
  "true";

// In tests, always disable (extra safety)
const isTest = import.meta.env.MODE === "test";

function shouldSend() {
  return enabled && !isTest;
}

export function captureMetric(
  name: string,
  value: number | Record<string, unknown>,
  context?: Record<string, unknown>
) {
  if (!shouldSend()) return;

  // TODO: later: send to OpenTelemetry / backend / collector
  if (consoleEnabled) {
    // eslint-disable-next-line no-console
    console.log("[telemetry] Captured metric:", name, value, context ?? {});
  }
}

export function captureException(
  err: unknown,
  context?: Record<string, unknown>
) {
  if (!shouldSend()) return;

  // TODO: later: send to Sentry / OTel logs / backend
  if (consoleEnabled) {
    // eslint-disable-next-line no-console
    console.error("[telemetry] Captured exception:", err, context ?? {});
  }
}
