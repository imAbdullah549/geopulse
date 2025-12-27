import { Badge } from "@/components/ui/badge";
import type { Severity } from "@/shared/types/device";
import type { AlertStatus } from "@/shared/types/alert";

export function SeverityBadge({ value }: { value: Severity }) {
  const variant =
    value === "high"
      ? "destructive"
      : value === "medium"
      ? "secondary"
      : "outline";
  const label = value.charAt(0).toUpperCase() + value.slice(1);
  return (
    <Badge variant={variant} title={label}>
      {label}
    </Badge>
  );
}

export function StatusBadge({ value }: { value: AlertStatus }) {
  const variant =
    value === "resolved"
      ? "secondary"
      : value === "acknowledged"
      ? "outline"
      : "default";
  const label = value.charAt(0).toUpperCase() + value.slice(1);
  return (
    <Badge variant={variant} title={label}>
      {label}
    </Badge>
  );
}
