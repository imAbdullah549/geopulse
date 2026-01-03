import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

// Wrap fetchBaseQuery to measure request durations and report lightweight metrics.
const rawBaseQuery = fetchBaseQuery({ baseUrl });

const timedBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const start = Date.now();
  const result = await rawBaseQuery(args, api, extraOptions);
  const duration = Date.now() - start;

  // collect basic context
  const url = typeof args === "string" ? args : (args as any).url;
  const method =
    typeof args === "string" ? "GET" : (args as any).method ?? "GET";
  let status: number | string = "unknown";
  if ((result as any).error && (result as any).error.status) {
    status = (result as any).error.status;
  } else if ((result as any).meta?.response?.status) {
    status = (result as any).meta.response.status;
  } else if ((result as any).data && (result as any).status) {
    status = (result as any).status;
  }

  // Report metric asynchronously; swallow failures to avoid affecting app behavior
  try {
    import("@/lib/telemetry").then((mod) =>
      mod.captureMetric("api_fetch", { url, method, status, duration })
    );
  } catch (e) {
    // no-op
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: timedBaseQuery,
  tagTypes: ["Device", "Alert", "MapPoints"],
  endpoints: () => ({}),
});
