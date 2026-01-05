import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn, formatDateTime } from "@/lib/utils";
import { DeviceStatusBadge, SeverityBadge } from "@/components/badges/Badges";
import { getDeviceCues } from "../utils/deviceCues";
import type { Device } from "@/shared/types/device";
import type { CueLevel } from "@/lib/deviceRules";
import { memo, useMemo } from "react";

function formatAgeMins(mins: number) {
  if (!Number.isFinite(mins)) return "—";
  const m0 = Math.max(0, Math.round(mins));

  if (m0 < 60) return `${m0}m`;
  const h = Math.floor(m0 / 60);
  const m = m0 % 60;

  if (h < 24) return `${h}h ${m}m`;
  const d = Math.floor(h / 24);
  const hh = h % 24;
  return `${d}d ${hh}h`;
}

function cueVariant(level: CueLevel) {
  if (level === "crit") return "destructive";
  if (level === "warn") return "secondary";
  return "secondary";
}

function cueClass(level: CueLevel) {
  if (level === "crit") return "";
  if (level === "warn")
    return "border border-amber-200/70 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200";
  return "";
}

function Cue({
  children,
  level = "warn",
}: {
  children: React.ReactNode;
  level?: CueLevel;
}) {
  return (
    <Badge
      variant={cueVariant(level)}
      className={cn("h-5 px-2 text-[11px] font-medium", cueClass(level))}
    >
      {children}
    </Badge>
  );
}

type DeviceRowProps = {
  device: Device;
  staleThreshold: number;
};

export const DeviceRow = memo(function DeviceRow({
  device: d,
  staleThreshold,
}: DeviceRowProps) {
  const cues = useMemo(
    () => getDeviceCues(d, staleThreshold),
    [d, staleThreshold]
  );

  const lastPing = useMemo(
    () => formatDateTime(d.telemetry?.lastPingAt),
    [d.telemetry?.lastPingAt]
  );

  const lastData = useMemo(
    () => formatDateTime(d.telemetry?.lastDataAt),
    [d.telemetry?.lastDataAt]
  );

  const typeLabel = useMemo(
    () => String(d.type ?? "").replaceAll("_", " "),
    [d.type]
  );

  const rowClass = cn(
    cues.worst === "warn" && "bg-amber-50/40 dark:bg-amber-950/15",
    cues.worst === "crit" && "bg-destructive/5"
  );

  return (
    <TableRow className={rowClass}>
      <TableCell className="font-medium whitespace-nowrap">{d.id}</TableCell>

      <TableCell className="flex items-center gap-2">
        <span className="truncate">{d.name}</span>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-1">
          {cues.staleLvl !== "ok" ? (
            <Cue level={cues.staleLvl}>
              Stale {formatAgeMins(cues.staleMins)}
            </Cue>
          ) : null}

          {cues.batteryLvl !== "ok" ? (
            <Cue level={cues.batteryLvl}>
              {cues.batteryLvl === "crit" ? "Battery critical" : "Low batt"}
            </Cue>
          ) : null}

          {cues.healthLvl !== "ok" ? (
            <Cue level={cues.healthLvl}>{cues.health}</Cue>
          ) : null}

          {cues.statusLvl !== "ok" ? (
            <Cue level={cues.statusLvl}>
              {cues.statusLvl === "crit" ? "Offline" : "Degraded"}
            </Cue>
          ) : null}

          {!cues.hasAnyCue ? (
            <span className="text-xs text-muted-foreground">—</span>
          ) : null}
        </div>
      </TableCell>

      <TableCell className="capitalize">{typeLabel}</TableCell>

      <TableCell className={cn(cues.statusLvl !== "ok" && "font-medium")}>
        <DeviceStatusBadge value={d.status} />
      </TableCell>

      <TableCell
        className={cn("capitalize", cues.healthLvl !== "ok" && "font-medium")}
      >
        {cues.health}
      </TableCell>

      <TableCell className={cn(cues.batteryLvl !== "ok" && "font-medium")}>
        {typeof cues.battery === "number" ? (
          <span
            className={cn(
              cues.batteryLvl === "crit" && "text-destructive",
              cues.batteryLvl === "warn" && "text-amber-600 dark:text-amber-400"
            )}
          >
            {cues.battery}%
          </span>
        ) : (
          "—"
        )}
      </TableCell>

      <TableCell className="text-right whitespace-nowrap">{lastPing}</TableCell>

      <TableCell className="text-right whitespace-nowrap">
        <span className={cn(cues.staleLvl !== "ok" && "font-medium")}>
          {lastData}
        </span>
        {cues.staleLvl !== "ok" ? (
          <div className="text-[11px] text-muted-foreground">
            {formatAgeMins(cues.staleMins)}
          </div>
        ) : null}
      </TableCell>

      <TableCell>{d.location?.locationName ?? "—"}</TableCell>

      <TableCell>
        <SeverityBadge value={d.severity} />
      </TableCell>
    </TableRow>
  );
});
