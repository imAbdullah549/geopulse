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
import {
  contentClass,
  inputClass,
  rootClass,
  rowWrapClass,
  triggerClass,
} from "@/components/filters/filterStyles";

export type DevicesFiltersProps = {
  search: string;
  setSearch: (v: string) => void;
  status: DeviceStatus | "all";
  setStatus: (v: DeviceStatus | "all") => void;
  severity: Severity | "all";
  setSeverity: (v: Severity | "all") => void;
};

export function DevicesFilters({
  search,
  setSearch,
  status,
  setStatus,
  severity,
  setSeverity,
}: DevicesFiltersProps) {
  return (
    <div className={rootClass}>
      <Input
        aria-label="Search devices"
        placeholder="Search by name or id…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={inputClass}
      />

      <div className={rowWrapClass}>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as DeviceStatus | "all")}
        >
          <SelectTrigger aria-label="Filter by status" className={triggerClass}>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent align="start" className={contentClass}>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>

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
      </div>
    </div>
  );
}

export default memo(DevicesFilters);
