import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { DevicesSortField, SortOrder } from "@/shared/types/device";
import type { DevicesFiltersValue } from "./types";
import { parseOptNumber } from "../../utils/deviceFilters";
import { SORT_LABEL } from "./constants";

type Props = {
  draft: DevicesFiltersValue;
  setDraft: React.Dispatch<React.SetStateAction<DevicesFiltersValue>>;
  disabled?: boolean;
  isDirty: boolean;
  advancedCount: number;
  onApply: () => void;
  onReset: () => void;
};

export function AdvancedFiltersSheet({
  draft,
  setDraft,
  disabled,
  isDirty,
  advancedCount,
  onApply,
  onReset,
}: Props) {
  return (
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
          <Button variant="ghost" onClick={onReset} disabled={disabled}>
            Reset
          </Button>

          <SheetClose asChild>
            <Button
              variant="outline"
              onClick={onApply}
              disabled={disabled || !isDirty}
            >
              Apply
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
