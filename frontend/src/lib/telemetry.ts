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

/**
 * Low-level: keep as internal building blocks.
 * Later you can swap these to send to Sentry/OTel/backend without touching app code.
 */
function emitMetric(
  name: string,
  value: number,
  attrs?: Record<string, unknown>
) {
  if (!shouldSend()) return;

  // TODO: later: send to OpenTelemetry / backend / collector
  if (consoleEnabled) {
    // eslint-disable-next-line no-console
    console.log("[telemetry][metric]", name, value, attrs ?? {});
  }
}

function emitException(err: unknown, attrs?: Record<string, unknown>) {
  if (!shouldSend()) return;

  // TODO: later: send to Sentry / OTel logs / backend
  if (consoleEnabled) {
    // eslint-disable-next-line no-console
    console.error("[telemetry][exception]", err, attrs ?? {});
  }
}

/**
 * Counter: "how many times" (requests, errors, clicks)
 * Histogram/Duration: "how long / how big" (ms, bytes, counts)
 * Exception: "something crashed / failed"
 */

// Counter: increments by `inc` (default 1)
export function trackCount(
  name: string,
  attrs?: Record<string, unknown>,
  inc = 1
) {
  // A counter is still emitted as a number; backend aggregates sums/rates.
  emitMetric(name, inc, attrs);
}

// Duration/Histogram: records a numeric value (ms, size, etc.)
export function trackDurationMs(
  name: string,
  ms: number,
  attrs?: Record<string, unknown>
) {
  // Clamp to avoid negatives / NaN breaking dashboards
  const safe = Number.isFinite(ms) ? Math.max(0, Math.round(ms)) : 0;
  emitMetric(name, safe, attrs);
}

// Generic histogram/value (optional)
export function trackValue(
  name: string,
  value: number,
  attrs?: Record<string, unknown>
) {
  const safe = Number.isFinite(value) ? value : 0;
  emitMetric(name, safe, attrs);
}

// Exception: capture error object + context
export function trackException(err: unknown, attrs?: Record<string, unknown>) {
  emitException(err, attrs);
}
