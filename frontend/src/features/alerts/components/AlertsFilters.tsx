import { memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Severity } from "@/shared/types/device";
import type { AlertStatus } from "@/shared/types/alert";
import {
  contentClass,
  inputClass,
  rootClass,
  rowWrapClass,
  triggerClass,
} from "@/components/filters/filterStyles";

export type AlertsFiltersProps = {
  search: string;
  setSearch: (v: string) => void;
  severity: Severity | "all";
  setSeverity: (v: Severity | "all") => void;
  status: AlertStatus | "all";
  setStatus: (v: AlertStatus | "all") => void;
};

export function AlertsFilters({
  search,
  setSearch,
  severity,
  setSeverity,
  status,
  setStatus,
}: AlertsFiltersProps) {
  return (
    <div className={rootClass}>
      <Input
        aria-label="Search alerts"
        placeholder="Search by title or device id…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={inputClass}
      />

      <div className={rowWrapClass}>
        <Select
          value={severity}
          onValueChange={(v) => setSeverity(v as Severity | "all")}
        >
          <SelectTrigger
            aria-label="Filter by severity"
            className={triggerClass}
          >
            <SelectValue placeholder="All severities" />
          </SelectTrigger>
          <SelectContent align="start" className={contentClass}>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={(v) => setStatus(v as AlertStatus | "all")}
        >
          <SelectTrigger aria-label="Filter by status" className={triggerClass}>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent align="start" className={contentClass}>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default memo(AlertsFilters);
