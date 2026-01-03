import * as React from "react";
import { Copy, MapPin, Clock, Cpu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import type { MapPointDto } from "@/shared/types/map";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** ------- small utilities ------- **/
function formatTimestamp(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function formatCoords(lat: number, lng: number) {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

async function copyToClipboard(text: string, label = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error("Copy failed");
  }
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon}
        <span className="uppercase tracking-wide">{title}</span>
      </div>
      <div className="text-sm">{children}</div>
    </section>
  );
}

function ValueRow({
  value,
  copyValue,
  className,
}: {
  value: React.ReactNode;
  copyValue?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-3 rounded-lg border bg-card px-3 py-2",
        className
      )}
    >
      <div className="min-w-0 flex-1 break-words">{value}</div>
      {copyValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Copy"
          onClick={() => copyToClipboard(copyValue)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      ) : null}
    </div>
  );
}

function SeverityBadge({ severity }: { severity: MapPointDto["severity"] }) {
  const variant =
    severity === "high"
      ? "destructive"
      : severity === "medium"
      ? "secondary"
      : "outline";

  return (
    <Badge variant={variant} className="capitalize">
      {severity}
    </Badge>
  );
}

function StatusBadge({ status }: { status: MapPointDto["status"] }) {
  const variant = status === "open" ? "default" : "secondary";
  return (
    <Badge variant={variant} className="capitalize">
      {status}
    </Badge>
  );
}

/** ------- main component ------- **/
export function DetailsDrawer({
  point,
  open,
  onOpenChange,
}: {
  point: MapPointDto | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);

  const title = point?.title?.trim() || "Details";

  const coords = point ? formatCoords(point.lat, point.lng) : null;

  const deviceLabel =
    point && (point.deviceName || point.deviceId)
      ? `${point.deviceName ?? "Unknown"}${
          point.deviceId ? ` (${point.deviceId})` : ""
        }`
      : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isDesktop ? "right" : "bottom"}
        className={cn(isDesktop ? "w-[420px] sm:w-[480px]" : "h-[75vh]", "p-0")}
      >
        <SheetHeader className="px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <SheetTitle className="truncate">{title}</SheetTitle>

              {point ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={point.severity} />
                  <StatusBadge status={point.status} />
                </div>
              ) : (
                <div className="mt-2 text-sm text-muted-foreground">
                  Select a point on the map to see details.
                </div>
              )}
            </div>
          </div>
        </SheetHeader>

        <Separator />

        <div className="px-5 py-4 space-y-5">
          {!point ? null : (
            <>
              <Section title="Timestamp" icon={<Clock className="h-4 w-4" />}>
                <ValueRow value={formatTimestamp(point.timestamp)} />
              </Section>

              <Section title="Location" icon={<MapPin className="h-4 w-4" />}>
                <ValueRow value={coords} copyValue={coords ?? undefined} />
                {/* Optional: future action buttons row (navigate, zoom, etc.) */}
                {/* <div className="mt-2 flex gap-2">
                  <Button variant="secondary" size="sm">Zoom to point</Button>
                  <Button variant="outline" size="sm">Directions</Button>
                </div> */}
              </Section>

              {deviceLabel ? (
                <Section title="Device" icon={<Cpu className="h-4 w-4" />}>
                  <ValueRow
                    value={deviceLabel}
                    copyValue={point.deviceId || undefined}
                  />
                </Section>
              ) : null}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
