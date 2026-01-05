import { memo, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { DevicesFiltersBarProps } from "./types";
import {
  ALL_HEALTH,
  ALL_SEVERITY,
  ALL_STATUS,
  ALL_TYPES,
  SORT_LABEL,
} from "./constants";
import { countAdvanced, normalize, toggle } from "../../utils/deviceFilters";
import { useDevicesFiltersDraft } from "./useDevicesFiltersDraft";
import { MultiSelectFilterMenu } from "./MultiSelectFilterMenu";
import { AdvancedFiltersSheet } from "./AdvancedFiltersSheet";

export const DevicesFiltersBar = memo(function DevicesFiltersBar({
  value,
  disabled,
  onApply,
  onReset,
}: DevicesFiltersBarProps) {
  const { draft, setDraft, isDirty, resetDraftOrApplied } =
    useDevicesFiltersDraft({
      value,
      onResetApplied: onReset,
    });

  const advancedCount = useMemo(() => countAdvanced(draft), [draft]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      {/* Left side (scrolls nicely) */}
      <div className="min-w-0 overflow-hidden">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-2 pr-2 pb-2">
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

            <MultiSelectFilterMenu
              label="Type"
              title="Device type"
              values={draft.type}
              options={ALL_TYPES}
              disabled={disabled}
              itemLabel={(t) => t.replaceAll("_", " ")}
              onToggle={(t) =>
                setDraft((p) => ({ ...p, type: normalize(toggle(p.type, t)) }))
              }
            />

            <MultiSelectFilterMenu
              label="Status"
              title="Status"
              values={draft.status}
              options={ALL_STATUS}
              disabled={disabled}
              onToggle={(s) =>
                setDraft((p) => ({
                  ...p,
                  status: normalize(toggle(p.status, s)),
                }))
              }
            />

            <MultiSelectFilterMenu
              label="Health"
              title="Health"
              values={draft.health}
              options={ALL_HEALTH}
              disabled={disabled}
              onToggle={(h) =>
                setDraft((p) => ({
                  ...p,
                  health: normalize(toggle(p.health, h)),
                }))
              }
            />

            <MultiSelectFilterMenu
              label="Priority"
              title="Priority"
              values={draft.severity}
              options={ALL_SEVERITY}
              disabled={disabled}
              onToggle={(sev) =>
                setDraft((p) => ({
                  ...p,
                  severity: normalize(toggle(p.severity, sev)),
                }))
              }
            />

            <div className="shrink-0 text-sm text-muted-foreground px-2">
              Sort: {SORT_LABEL[draft.orderBy]}{" "}
              {draft.order === "desc" ? "↓" : "↑"}
            </div>
          </div>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Right side (fixed) */}
      <div className="flex items-center gap-2 justify-self-end">
        <AdvancedFiltersSheet
          draft={draft}
          setDraft={setDraft}
          disabled={disabled}
          isDirty={isDirty}
          advancedCount={advancedCount}
          onApply={() => onApply(draft)}
          onReset={resetDraftOrApplied}
        />

        <Button onClick={() => onApply(draft)} disabled={disabled || !isDirty}>
          Apply
        </Button>

        <Button
          variant="ghost"
          onClick={resetDraftOrApplied}
          disabled={disabled}
        >
          Reset
        </Button>
      </div>
    </div>
  );
});
