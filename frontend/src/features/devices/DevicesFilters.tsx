import { memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DeviceStatus, Severity } from "@/shared/types/device";
import { cn } from "@/lib/utils";

export type DevicesFiltersProps = {
  search: string;
  setSearch: (v: string) => void;
  status: DeviceStatus | "all";
  setStatus: (v: DeviceStatus | "all") => void;
  severity: Severity | "all";
  setSeverity: (v: Severity | "all") => void;
};

const controlBase =
  "h-10 bg-background border-border/70 shadow-sm focus-visible:ring-2 focus-visible:ring-ring/40";

const triggerClass = cn(
  controlBase,
  "w-full md:w-[180px] justify-between", // stable width
  "px-3"
);

export function DevicesFilters({
  search,
  setSearch,
  status,
  setStatus,
  severity,
  setSeverity,
}: DevicesFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <Input
        aria-label="Search devices"
        placeholder="Search by name or id…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(controlBase, "w-full md:flex-1 md:min-w-[360px]")}
      />
      <div className="flex w-full flex-wrap gap-3 md:w-auto md:flex-nowrap md:justify-end">
        <Select
          aria-label="Filter by status"
          value={status}
          onValueChange={(v) => setStatus(v as DeviceStatus | "all")}
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>

        <Select
          aria-label="Filter by severity"
          value={severity}
          onValueChange={(v) => setSeverity(v as Severity | "all")}
        >
          <SelectTrigger className={triggerClass}>
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All severities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export default memo(DevicesFilters);
