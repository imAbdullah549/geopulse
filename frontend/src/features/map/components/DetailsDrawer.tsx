import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { MapPointDto } from "@/shared/types/map";

export function DetailsDrawer({
  point,
  open,
  onOpenChange,
}: {
  point: MapPointDto | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[460px]">
        <SheetHeader>
          <SheetTitle>{point?.title ?? "Details"}</SheetTitle>
        </SheetHeader>

        {!point ? (
          <div className="mt-6 text-sm text-muted-foreground">
            No selection.
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex gap-2">
              <Badge className="capitalize" variant="secondary">
                {point.severity}
              </Badge>
              <Badge className="capitalize" variant="outline">
                {point.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Timestamp</div>
              <div>{new Date(point.timestamp).toLocaleString()}</div>
            </div>

            <div className="space-y-1">
              <div className="text-muted-foreground">Location</div>
              <div>
                {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
              </div>
            </div>

            {(point.deviceId || point.deviceName) && (
              <div className="space-y-1">
                <div className="text-muted-foreground">Device</div>
                <div>
                  {point.deviceName ?? "Unknown"}{" "}
                  {point.deviceId ? `(${point.deviceId})` : ""}
                </div>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
