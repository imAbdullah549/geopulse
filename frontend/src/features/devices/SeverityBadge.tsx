import { cn } from "@/lib/utils";

type Severity = "low" | "medium" | "high";

const severityStyles: Record<Severity, string> = {
  low: "bg-muted text-muted-foreground border-border",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium capitalize",
        severityStyles[severity]
      )}
    >
      {severity}
    </span>
  );
}
