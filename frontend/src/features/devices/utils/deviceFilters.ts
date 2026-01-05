import type { DevicesFiltersValue } from "../components/Filters/types";

export function toggle<T extends string>(arr: T[] | undefined, v: T): T[] {
  const cur = arr ?? [];
  return cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
}

export function normalize<T>(arr: T[] | undefined): T[] | undefined {
  return arr && arr.length ? arr : undefined;
}

export function parseOptNumber(raw: string): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

export function labelMulti(base: string, values?: string[]) {
  if (!values?.length) return base;
  return values.length === 1
    ? `${base}: ${values[0].replaceAll("_", " ")}`
    : `${base}: ${values.length}`;
}

function sortStrings(arr?: string[]) {
  return arr ? [...arr].sort() : undefined;
}

export function filtersKey(v: DevicesFiltersValue) {
  const normalized = {
    ...v,
    search: v.search.trim(),
    type: sortStrings(v.type),
    status: sortStrings(v.status),
    health: sortStrings(v.health),
    severity: sortStrings(v.severity),
  };
  return JSON.stringify(normalized);
}

export function countAdvanced(v: DevicesFiltersValue) {
  let n = 0;
  if (typeof v.batteryMin === "number") n++;
  if (typeof v.batteryMax === "number") n++;
  if (typeof v.staleMins === "number") n++;
  return n;
}
