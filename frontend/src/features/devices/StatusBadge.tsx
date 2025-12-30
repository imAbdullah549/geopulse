import { cn } from "@/lib/utils";

type DeviceStatus = "online" | "offline" | "warning";

const statusStyles: Record<DeviceStatus, string> = {
  online: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  offline: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
