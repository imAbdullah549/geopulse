import React, { memo } from "react";
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
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <Input
        aria-label="Search alerts"
        placeholder="Search by title or device id…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select
        aria-label="Filter by severity"
        value={severity}
        onValueChange={(v) => setSeverity(v as Severity | "all")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All severities</SelectItem>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Select
        aria-label="Filter by status"
        value={status}
        onValueChange={(v) => setStatus(v as AlertStatus | "all")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="acknowledged">Acknowledged</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default memo(AlertsFilters);
