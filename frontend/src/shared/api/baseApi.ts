import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { trackCount, trackDurationMs, trackException } from "@/lib/telemetry";
import { PARAM_ALLOWLIST_BY_ENDPOINT } from "@/shared/api/telemetry";
import { pickParams, sanitizeParams } from "@/shared/api/telemetry/sanitize";

/**
 * Compute the effective base URL for API requests.
 *
 * - If `rawBase` is absolute (starts with protocol), it is returned unchanged.
 * - If `rawBase` is relative (starts with `/`), we prefix with `http://localhost`
 *   when running under Node-like environments where `Request`/undici expects absolute URLs.
 *
 * The function is exported for unit testing and clarity.
 */
export function computeBaseUrl(
  rawBase = import.meta.env.VITE_API_BASE_URL ?? "/api",
  env: Record<string, string | undefined> = (typeof process !== "undefined" &&
    (process as any).env) ||
    {},
  isWindow = typeof window !== "undefined"
) {
  const shouldPrefix =
    typeof rawBase === "string" &&
    rawBase.startsWith("/") &&
    (!isWindow ||
      env.VITEST === "true" ||
      env.CI === "true" ||
      env.GITHUB_ACTIONS === "true");

  return shouldPrefix ? `http://localhost${rawBase}` : rawBase;
}

const baseUrl = computeBaseUrl();
const rawBaseQuery = fetchBaseQuery({ baseUrl });

function pickUrlPath(args: unknown) {
  const url = typeof args === "string" ? args : (args as any)?.url;
  if (typeof url !== "string") return "unknown";
  // Avoid logging query strings (may include search terms / ids)
  return url.split("?")[0] ?? url;
}

function pickMethod(args: unknown) {
  const method =
    typeof args === "string" ? "GET" : (args as any)?.method ?? "GET";
  return String(method).toUpperCase();
}

function pickStatus(result: unknown): number | string {
  const r: any = result;
  if (r?.error?.status != null) return r.error.status;
  if (r?.meta?.response?.status != null) return r.meta.response.status;
  return "unknown";
}

function normalizeFetchError(error: unknown) {
  // RTK Query FetchBaseQueryError often has { status: number | "FETCH_ERROR" | ... }
  const e: any = error;
  const status = e?.status;

  if (typeof status === "number") {
    return { errorKind: "http", httpStatus: status };
  }
  if (typeof status === "string") {
    return { errorKind: status.toLowerCase() };
  }
  return { errorKind: "unknown" };
}

/**
 * One place for all network telemetry (best practice).
 * - Counters: net.request, net.error (value=1 per occurrence)
 * - Duration: net.response_ms
 * - Exception: trackException for error details
 *
 * Optional: attach allowlisted query params per endpoint (if endpoint returns { url, params }).
 */
const baseQueryWithTelemetry: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  const startedAt = performance.now();

  const requestId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const urlPath = pickUrlPath(args);
  const method = pickMethod(args);

  // ✅ Allowlisted, sanitized params (only works when endpoints use { url, params })
  const allow = PARAM_ALLOWLIST_BY_ENDPOINT[api.endpoint];
  const query = sanitizeParams(allow, pickParams(args));

  const common = {
    area: "net",
    requestId,
    endpoint: api.endpoint,
    type: api.type, // "query" | "mutation"
    method,
    urlPath,
    ...(query ? { query } : {}),
  };

  // Counter: one request happened
  trackCount("net.request", common);

  const result = await rawBaseQuery(args, api, extraOptions);
  const ms = Math.round(performance.now() - startedAt);
  const status = pickStatus(result);

  // Histogram/Duration: request time
  trackDurationMs("net.response_ms", ms, { ...common, status });

  // Error: counter + exception (captured once, centrally)
  if ((result as any)?.error) {
    const err = (result as any).error;
    const errMeta = normalizeFetchError(err);

    // Counter: one error happened
    trackCount("net.error", { ...common, status, ms, ...errMeta });

    // Exception: details for debugging
    trackException(err, { ...common, status, ms, ...errMeta });
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithTelemetry,
  tagTypes: ["Device", "Alert", "MapPoints"],
  endpoints: () => ({}),
});
