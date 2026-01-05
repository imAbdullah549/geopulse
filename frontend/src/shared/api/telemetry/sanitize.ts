export type Params = Record<string, unknown>;

const SENSITIVE_KEYS = new Set([
  "search",
  "q",
  "query",
  "email",
  "token",
  "authorization",
]);

export function pickParams(args: unknown): Params | undefined {
  const p = (args as any)?.params;
  return p && typeof p === "object" ? (p as Params) : undefined;
}

function toNumberIfNumericString(v: unknown) {
  if (typeof v !== "string") return v;
  const s = v.trim();
  if (s === "") return v;

  // strict numeric check (so "01" becomes 1, "1.2" becomes 1.2)
  const n = Number(s);
  return Number.isFinite(n) && String(n) === s.replace(/^(\+)?0+(?=\d)/, "")
    ? n
    : Number.isFinite(n) && /^[+-]?\d+(\.\d+)?$/.test(s)
    ? n
    : v;
}

function splitCsvIfString(v: unknown) {
  if (typeof v !== "string") return v;
  return v.includes(",")
    ? v
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
    : v;
}

/**
 * Sanitize query params for telemetry:
 * - Only include allowlisted keys for this endpoint
 * - Exclude sensitive keys
 * - Normalize: numeric strings -> numbers, csv strings -> arrays
 */
export function sanitizeParams(
  allow: ReadonlySet<string> | undefined,
  params?: Params
): Record<string, unknown> | undefined {
  if (!allow || allow.size === 0 || !params) return undefined;

  const out: Record<string, unknown> = {};

  for (const [k, v] of Object.entries(params)) {
    if (SENSITIVE_KEYS.has(k)) continue;
    if (!allow.has(k)) continue;

    const csv = splitCsvIfString(v);
    const normalized = Array.isArray(csv)
      ? csv.map(toNumberIfNumericString)
      : toNumberIfNumericString(csv);

    out[k] = normalized;
  }

  return Object.keys(out).length ? out : undefined;
}
