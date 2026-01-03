// FilterDrawer.tsx
// Right-side drawer using shadcn/ui Sheet (NOT Drawer).
// Install: npx shadcn@latest add sheet button badge input switch toggle-group separator scroll-area

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MapFilters } from "../types";
import { Label } from "@/components/ui/label";

// ---- Types derived from your MapFilters (supports optional severities/year) ----
type Severity = NonNullable<MapFilters["severities"]>[number];

// Change these if your backend expects different values.
const SEVERITY_OPTIONS = ["low", "medium", "high"] as const;
const labelSeverity = (s: string) =>
  s === "low" ? "Low" : s === "medium" ? "Medium" : s === "high" ? "High" : s;

function asArray<T>(v: T[] | undefined): T[] {
  return v ?? [];
}

// year in your project is number | undefined (NOT null)
function normalizeYearInput(input: string): {
  value: number | undefined;
  isValid: boolean;
} {
  const t = input.trim();
  if (!t) return { value: undefined, isValid: true };
  if (!/^\d{1,4}$/.test(t)) return { value: undefined, isValid: false };
  const y = Number(t);
  if (!Number.isFinite(y)) return { value: undefined, isValid: false };
  if (y < 1900 || y > 2100) return { value: undefined, isValid: false };
  return { value: y, isValid: true };
}

function sameFilters(a: MapFilters, b: MapFilters) {
  const aSev = [...asArray(a.severities)].sort().join(",");
  const bSev = [...asArray(b.severities)].sort().join(",");
  return aSev === bSev && a.year === b.year && a.onlyActive === b.onlyActive;
}

function countActive(f: MapFilters) {
  const sev = asArray(f.severities).length;
  const year = f.year ? 1 : 0;
  const active = f.onlyActive ? 1 : 0;
  return sev + year + active;
}

export function FilterDrawer({
  value,
  onChange,
}: {
  value: MapFilters;
  onChange: (next: MapFilters) => void;
}) {
  const [open, setOpen] = React.useState(false);

  // Draft state: user edits here, Apply commits to parent
  const [draft, setDraft] = React.useState<MapFilters>(value);
  const [yearInput, setYearInput] = React.useState<string>(
    value.year ? String(value.year) : ""
  );
  const [yearValid, setYearValid] = React.useState(true);

  const draftSeverities = React.useMemo(
    () => asArray(draft.severities),
    [draft.severities]
  );
  const appliedCount = React.useMemo(() => countActive(value), [value]);
  const draftCount = React.useMemo(() => countActive(draft), [draft]);
  const hasChanges = React.useMemo(
    () => !sameFilters(draft, value),
    [draft, value]
  );

  // When sheet opens, sync draft from applied value
  React.useEffect(() => {
    if (!open) return;
    setDraft(value);
    setYearInput(value.year ? String(value.year) : "");
    setYearValid(true);
  }, [open, value]);

  const closeAsCancel = React.useCallback(() => {
    // revert to applied and close
    setDraft(value);
    setYearInput(value.year ? String(value.year) : "");
    setYearValid(true);
    setOpen(false);
  }, [value]);

  // Closing via overlay / ESC should behave like Cancel (best UX for draft forms)
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (next) setOpen(true);
      else closeAsCancel();
    },
    [closeAsCancel]
  );

  const setSeverities = React.useCallback((severities: Severity[]) => {
    setDraft((prev) => ({
      ...prev,
      // store undefined when empty to match your optional type & keep params clean
      severities: severities.length ? severities : undefined,
    }));
  }, []);

  const onYearChange = React.useCallback((next: string) => {
    setYearInput(next);
    const parsed = normalizeYearInput(next);
    setYearValid(parsed.isValid);
    setDraft((prev) => ({ ...prev, year: parsed.value }));
  }, []);

  const clearYear = React.useCallback(() => {
    setYearInput("");
    setYearValid(true);
    setDraft((prev) => ({ ...prev, year: undefined }));
  }, []);

  const apply = React.useCallback(() => {
    if (!yearValid) return;
    onChange(draft);
    setOpen(false);
  }, [draft, onChange, yearValid]);

  const chips = React.useMemo(() => {
    const items: Array<{ key: string; label: string }> = [];
    for (const s of draftSeverities) {
      items.push({
        key: `sev:${String(s)}`,
        label: `Severity: ${labelSeverity(String(s))}`,
      });
    }
    if (draft.year) items.push({ key: "year", label: `Year: ${draft.year}` });
    if (draft.onlyActive)
      items.push({ key: "onlyActive", label: "Only active" });
    return items;
  }, [draftSeverities, draft.year, draft.onlyActive]);

  const removeChip = React.useCallback(
    (key: string) => {
      if (key.startsWith("sev:")) {
        const sev = key.split(":")[1];
        setSeverities(
          draftSeverities.filter(
            (x) => String(x) !== sev
          ) as unknown as Severity[]
        );
        return;
      }
      if (key === "year") {
        clearYear();
        return;
      }
      if (key === "onlyActive") {
        setDraft((prev) => ({ ...prev, onlyActive: false }));
      }
    },
    [clearYear, draftSeverities, setSeverities]
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button size="sm" variant="secondary" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          {appliedCount > 0 ? (
            <span className="ml-1 rounded-full bg-background/70 px-2 py-0.5 text-xs">
              {appliedCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[420px] sm:w-[480px] p-0">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between gap-3">
            <SheetHeader className="p-0">
              <div className="flex items-baseline gap-2">
                <SheetTitle className="text-lg">Filters</SheetTitle>
                {hasChanges ? (
                  <span className="text-xs text-muted-foreground">
                    (unsaved)
                  </span>
                ) : null}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {draftCount > 0
                  ? "Adjust filters and press Apply."
                  : "No filters applied."}
              </div>
            </SheetHeader>
          </div>

          {/* Chips row */}
          {draftCount > 0 ? (
            <div className="mt-3">
              <ScrollArea className="max-h-20">
                <div className="flex flex-wrap gap-2 pr-2">
                  {chips.map((c) => (
                    <Badge
                      key={c.key}
                      variant="secondary"
                      className="flex items-center gap-1 rounded-full px-3 py-1"
                    >
                      <span className="text-xs">{c.label}</span>
                      <button
                        type="button"
                        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/10"
                        onClick={() => removeChip(c.key)}
                        aria-label={`Remove ${c.label}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : null}
        </div>

        {/* Body */}
        <ScrollArea className="h-[calc(100vh-168px)]">
          <div className="space-y-6 p-4">
            {/* Severity */}
            <section className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">Severity</div>
                  <div className="text-xs text-muted-foreground">
                    Select one or more
                  </div>
                </div>
              </div>

              <ToggleGroup
                type="multiple"
                value={draftSeverities.map(String)}
                onValueChange={(v) => setSeverities(v as unknown as Severity[])}
                className="justify-start"
              >
                {SEVERITY_OPTIONS.map((s) => (
                  <ToggleGroupItem
                    key={s}
                    value={s}
                    className="h-9 rounded-lg px-4"
                  >
                    {labelSeverity(s)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </section>

            <Separator />

            {/* Year */}
            <section className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">Year</div>
                  <div className="text-xs text-muted-foreground">
                    1900–2100 (empty = all)
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2"
                  onClick={clearYear}
                  disabled={!yearInput}
                >
                  Clear
                </Button>
              </div>

              <Input
                inputMode="numeric"
                placeholder="e.g. 2025"
                value={yearInput}
                onChange={(e) => onYearChange(e.target.value)}
              />

              {!yearValid ? (
                <div className="text-xs text-destructive">
                  Enter a valid year between 1900 and 2100.
                </div>
              ) : null}
            </section>

            <Separator />

            {/* Only active */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Only active</div>
                  <div className="text-xs text-muted-foreground">
                    Hide resolved points
                  </div>
                </div>
                <Switch
                  checked={!!draft.onlyActive}
                  onCheckedChange={(checked) =>
                    setDraft((prev) => ({ ...prev, onlyActive: checked }))
                  }
                />
              </div>
            </section>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t bg-background p-4">
          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={closeAsCancel}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={apply}
              disabled={!hasChanges || !yearValid}
            >
              Apply
            </Button>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Changes apply only when you press Apply.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
