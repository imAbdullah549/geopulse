import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import type { Severity } from "@/shared/types/map";
import type { MapFilters } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ALL_SEVERITIES: Severity[] = ["low", "medium", "high"];

export function FilterDrawer({
  value,
  onChange,
}: {
  value: MapFilters;
  onChange: (next: MapFilters) => void;
}) {
  const toggleSeverity = (sev: Severity) => {
    const current = value.severities ?? [];
    const set = new Set(current);
    set.has(sev) ? set.delete(sev) : set.add(sev);
    const next = Array.from(set);
    onChange({ ...value, severities: next.length ? next : undefined });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[360px] sm:w-[420px]">
        <SheetHeader>
          <SheetTitle>Map Filters</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Severity */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Severity</div>

            <div className="space-y-2">
              {ALL_SEVERITIES.map((sev) => {
                const checked = (value.severities ?? []).includes(sev);
                return (
                  <div key={sev} className="flex items-center gap-2">
                    <Checkbox
                      id={`sev-${sev}`}
                      checked={checked}
                      onCheckedChange={() => toggleSeverity(sev)}
                    />
                    <Label htmlFor={`sev-${sev}`} className="capitalize">
                      {sev}
                    </Label>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => onChange({ ...value, severities: undefined })}
              >
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  onChange({ ...value, severities: ALL_SEVERITIES })
                }
              >
                Select all
              </Button>
            </div>
          </div>

          {/* Year */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Year</div>
            <Input
              inputMode="numeric"
              placeholder="e.g. 2025"
              value={value.year ?? ""}
              onChange={(e) => {
                const raw = e.target.value.trim();
                if (!raw) return onChange({ ...value, year: undefined });

                const num = Number(raw);
                if (!Number.isFinite(num) || num < 1900 || num > 2100) return;
                onChange({ ...value, year: num });
              }}
            />
            <div className="text-xs text-muted-foreground">
              Empty = all years
            </div>
          </div>

          {/* Only active */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="only-active"
              checked={value.onlyActive}
              onCheckedChange={(checked) =>
                onChange({ ...value, onlyActive: Boolean(checked) })
              }
            />
            <Label htmlFor="only-active">
              Only active (open + acknowledged)
            </Label>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={() =>
              onChange({
                severities: undefined,
                year: undefined,
                onlyActive: false,
              })
            }
          >
            Reset all
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
