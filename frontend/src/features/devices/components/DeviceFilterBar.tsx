import { memo, useEffect, useMemo, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type {
  DeviceHealth,
  DeviceStatus,
  DeviceType,
  DevicesSortField,
  Severity,
  SortOrder,
} from "@/shared/types/device";

export type DevicesFiltersValue = {
  search: string;
  type?: DeviceType[];
  status?: DeviceStatus[];
  health?: DeviceHealth[];
  severity?: Severity[];
  batteryMin?: number;
  batteryMax?: number;
  staleMins?: number;
  orderBy: DevicesSortField;
  order: SortOrder;
};

type Props = {
  value: DevicesFiltersValue; // applied value (from page)
  disabled?: boolean;
  onApply: (next: DevicesFiltersValue) => void;
  onReset: () => void; // resets applied filters on the page
};

const ALL_TYPES: DeviceType[] = [
  "camera",
  "weather_sensor",
  "road_sensor",
  "air_sensor",
];
const ALL_STATUS: DeviceStatus[] = ["online", "offline", "degraded", "unknown"];
const ALL_HEALTH: DeviceHealth[] = ["good", "fair", "poor", "critical"];
const ALL_SEVERITY: Severity[] = ["low", "medium", "high"];

const SORT_LABEL: Record<DevicesSortField, string> = {
  name: "Name",
  severity: "Priority",
  status: "Status",
  health: "Health",
  batteryPct: "Battery",
  lastPingAt: "Last ping",
  lastDataAt: "Last data",
};

function toggle<T extends string>(arr: T[] | undefined, v: T): T[] {
  const cur = arr ?? [];
  return cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v];
}
function normalize<T>(arr: T[] | undefined): T[] | undefined {
  return arr && arr.length ? arr : undefined;
}
function parseOptNumber(raw: string): number | undefined {
  if (raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}
function labelMulti(base: string, values?: string[]) {
  if (!values?.length) return base;
  return values.length === 1
    ? `${base}: ${values[0].replaceAll("_", " ")}`
    : `${base}: ${values.length}`;
}

function countAdvanced(v: DevicesFiltersValue) {
  let n = 0;
  if (typeof v.batteryMin === "number") n++;
  if (typeof v.batteryMax === "number") n++;
  if (typeof v.staleMins === "number") n++;
  return n;
}

function FilterMenu({
  label,
  values,
  render,
  disabled,
}: {
  label: string;
  values?: string[];
  disabled?: boolean;
  render: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled} className="shrink-0">
          {labelMulti(label, values)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {render}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const DevicesFiltersBar = memo(function DevicesFiltersBar({
  value,
  disabled,
  onApply,
  onReset,
}: Props) {
  // Draft state (edits don't refetch until Apply)
  const [draft, setDraft] = useState<DevicesFiltersValue>(value);

  useEffect(() => setDraft(value), [value]);

  function sortStrings(arr?: string[]) {
    return arr ? [...arr].sort() : undefined;
  }

  function filtersKey(v: DevicesFiltersValue) {
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

  const isDirty = useMemo(
    () => filtersKey(draft) !== filtersKey(value),
    [draft, value]
  );

  const advancedCount = useMemo(() => countAdvanced(draft), [draft]);

  const handleResetClick = () => {
    // If user has pending edits, reset the draft first (no refetch).
    if (isDirty) {
      setDraft(value);
      return;
    }
    // Otherwise reset applied filters (page state).
    onReset();
  };

  return (
    // Grid guarantees right-side never gets pushed off-screen.
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      {/* Left side (scrolls) */}
      <div className="min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto pr-2 pb-1">
          <Input
            value={draft.search}
            onChange={(e) =>
              setDraft((p) => ({ ...p, search: e.target.value }))
            }
            placeholder="Search by name, id, type, or zone…"
            aria-label="Search devices"
            disabled={disabled}
            className="w-[360px] shrink-0"
          />

          <FilterMenu
            label="Type"
            values={draft.type}
            disabled={disabled}
            render={
              <>
                <DropdownMenuLabel>Device type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_TYPES.map((t) => (
                  <DropdownMenuCheckboxItem
                    key={t}
                    onSelect={(e) => e.preventDefault()}
                    checked={!!draft.type?.includes(t)}
                    onCheckedChange={() =>
                      setDraft((p) => ({
                        ...p,
                        type: normalize(toggle(p.type, t)),
                      }))
                    }
                  >
                    {t.replaceAll("_", " ")}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            }
          />

          <FilterMenu
            label="Status"
            values={draft.status}
            disabled={disabled}
            render={
              <>
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_STATUS.map((s) => (
                  <DropdownMenuCheckboxItem
                    key={s}
                    onSelect={(e) => e.preventDefault()}
                    checked={!!draft.status?.includes(s)}
                    onCheckedChange={() =>
                      setDraft((p) => ({
                        ...p,
                        status: normalize(toggle(p.status, s)),
                      }))
                    }
                  >
                    {s}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            }
          />

          <FilterMenu
            label="Health"
            values={draft.health}
            disabled={disabled}
            render={
              <>
                <DropdownMenuLabel>Health</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_HEALTH.map((h) => (
                  <DropdownMenuCheckboxItem
                    key={h}
                    onSelect={(e) => e.preventDefault()}
                    checked={!!draft.health?.includes(h)}
                    onCheckedChange={() =>
                      setDraft((p) => ({
                        ...p,
                        health: normalize(toggle(p.health, h)),
                      }))
                    }
                  >
                    {h}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            }
          />

          <FilterMenu
            label="Priority"
            values={draft.severity}
            disabled={disabled}
            render={
              <>
                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ALL_SEVERITY.map((sev) => (
                  <DropdownMenuCheckboxItem
                    key={sev}
                    onSelect={(e) => e.preventDefault()}
                    checked={!!draft.severity?.includes(sev)}
                    onCheckedChange={() =>
                      setDraft((p) => ({
                        ...p,
                        severity: normalize(toggle(p.severity, sev)),
                      }))
                    }
                  >
                    {sev}
                  </DropdownMenuCheckboxItem>
                ))}
              </>
            }
          />

          <div className="shrink-0 text-sm text-muted-foreground px-2">
            Sort: {SORT_LABEL[draft.orderBy]}{" "}
            {draft.order === "desc" ? "↓" : "↑"}
          </div>
        </div>
      </div>

      {/* Right side (fixed) */}
      <div className="flex items-center gap-2 justify-self-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" disabled={disabled}>
              More filters
              {advancedCount ? (
                <Badge variant="secondary" className="ml-2">
                  {advancedCount}
                </Badge>
              ) : null}
            </Button>
          </SheetTrigger>

          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader className="px-5 py-4">
              <SheetTitle>Advanced filters</SheetTitle>
            </SheetHeader>

            <div className="px-5 py-4 mt-4 space-y-5">
              <div className="space-y-2">
                <div className="text-sm font-medium">Battery</div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={draft.batteryMin?.toString() ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        batteryMin: parseOptNumber(e.target.value),
                      }))
                    }
                    placeholder="Min %"
                    inputMode="numeric"
                    disabled={disabled}
                  />
                  <Input
                    value={draft.batteryMax?.toString() ?? ""}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        batteryMax: parseOptNumber(e.target.value),
                      }))
                    }
                    placeholder="Max %"
                    inputMode="numeric"
                    disabled={disabled}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">Telemetry freshness</div>
                <Input
                  value={draft.staleMins?.toString() ?? ""}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      staleMins: parseOptNumber(e.target.value),
                    }))
                  }
                  placeholder="Stale ≥ minutes"
                  inputMode="numeric"
                  disabled={disabled}
                />
                <p className="text-xs text-muted-foreground">
                  Stale means last data is older than the threshold.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="text-sm font-medium">Sorting</div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    value={draft.orderBy}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        orderBy: e.target.value as DevicesSortField,
                      }))
                    }
                    disabled={disabled}
                    aria-label="Sort field"
                  >
                    {(
                      [
                        "lastPingAt",
                        "lastDataAt",
                        "batteryPct",
                        "health",
                        "status",
                        "severity",
                        "name",
                      ] as DevicesSortField[]
                    ).map((f) => (
                      <option key={f} value={f}>
                        {SORT_LABEL[f]}
                      </option>
                    ))}
                  </select>

                  <select
                    className="h-10 rounded-md border bg-background px-3 text-sm"
                    value={draft.order}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        order: e.target.value as SortOrder,
                      }))
                    }
                    disabled={disabled}
                    aria-label="Sort order"
                  >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                  </select>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-6 flex gap-2 sm:justify-end">
              <Button
                variant="ghost"
                onClick={handleResetClick}
                disabled={disabled}
              >
                Reset
              </Button>

              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={() => onApply(draft)}
                  disabled={disabled || !isDirty}
                >
                  Apply
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Button onClick={() => onApply(draft)} disabled={disabled || !isDirty}>
          Apply
        </Button>

        <Button variant="ghost" onClick={handleResetClick} disabled={disabled}>
          Reset
        </Button>
      </div>
    </div>
  );
});
