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
  env: Record<string, string | undefined> = process.env as Record<
    string,
    string | undefined
  >,
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

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Device", "Alert"],
  endpoints: () => ({}),
});
