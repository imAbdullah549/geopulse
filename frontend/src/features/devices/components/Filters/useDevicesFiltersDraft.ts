import { useCallback, useEffect, useMemo, useState } from "react";
import type { DevicesFiltersValue } from "./types";
import { filtersKey } from "../../utils/deviceFilters";

export function useDevicesFiltersDraft(args: {
  value: DevicesFiltersValue;
  onResetApplied: () => void;
}) {
  const { value, onResetApplied } = args;

  const [draft, setDraft] = useState<DevicesFiltersValue>(value);

  useEffect(() => setDraft(value), [value]);

  const isDirty = useMemo(
    () => filtersKey(draft) !== filtersKey(value),
    [draft, value]
  );

  const resetDraftOrApplied = useCallback(() => {
    // If user has pending edits, reset the draft first (no refetch).
    if (isDirty) {
      setDraft(value);
      return;
    }
    // Otherwise reset applied filters (page state).
    onResetApplied();
  }, [isDirty, value, onResetApplied]);

  return { draft, setDraft, isDirty, resetDraftOrApplied };
}
