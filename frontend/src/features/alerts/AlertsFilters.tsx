import { memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Severity } from "@/shared/types/device";
import type { AlertStatus } from "@/shared/types/alert";

export type AlertsFiltersProps = {
  search: string;
  setSearch: (v: string) => void;
  severity: Severity | "all";
  setSeverity: (v: Severity | "all") => void;
  status: AlertStatus | "all";
  setStatus: (v: AlertStatus | "all") => void;
};

const controlBase =
  "h-10 bg-background border-border/70 shadow-sm focus-visible:ring-2 focus-visible:ring-ring/40";

const triggerClass = cn(
  controlBase,
  "w-full md:w-[180px] justify-between", // stable width
  "px-3"
);

export function AlertsFilters({
  search,
  setSearch,
  severity,
  setSeverity,
  status,
  setStatus,
}: AlertsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      {/* Search grows */}
      <Input
        aria-label="Search alerts"
        placeholder="Search by title or device id…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(controlBase, "w-full md:flex-1 md:min-w-[360px]")}
      />

      <div className="flex w-full flex-wrap gap-3 md:w-auto md:flex-nowrap md:justify-end">
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
          <SelectContent align="start" className="w-[200px]">
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
          <SelectContent align="start" className="w-[200px]">
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
