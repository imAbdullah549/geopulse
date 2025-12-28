/*******************************************************************************
 * Simple telemetry helper (no-op by default)
 *
 * Replace or extend this module with a real provider (Sentry, Datadog, etc.)
 * in production. Keep the API minimal to make it easy to mock in tests.
 ******************************************************************************/

export function captureException(
  err: unknown,
  context?: Record<string, unknown>
) {
  // No-op in tests and development by default. Providers should override this.
  // Keep a console fallback to aid local debugging.
  // eslint-disable-next-line no-console
  console.error("Captured exception:", err, context ?? {});
}

export default captureException;
