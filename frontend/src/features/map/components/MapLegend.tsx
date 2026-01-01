export function MapLegend() {
  return (
    <div
      className={[
        "flex items-center gap-3",
        "rounded-xl border bg-background/90 backdrop-blur",
        "shadow-md shadow-black/5",
        "px-3 py-2",
      ].join(" ")}
      role="group"
      aria-label="Severity legend"
    >
      <LegendItem label="Low" variant="low" />
      <Divider />
      <LegendItem label="Medium" variant="medium" />
      <Divider />
      <LegendItem label="High" variant="high" />
    </div>
  );
}

function Divider() {
  return <span className="h-4 w-px bg-border/70" aria-hidden="true" />;
}

function LegendItem({
  label,
  variant,
}: {
  label: string;
  variant: "low" | "medium" | "high";
}) {
  const dotClass =
    variant === "high"
      ? "bg-destructive ring-destructive/25"
      : variant === "medium"
      ? "bg-foreground/70 ring-foreground/10"
      : "bg-background border border-foreground/25 ring-foreground/10";

  const textClass =
    variant === "high"
      ? "text-destructive"
      : variant === "medium"
      ? "text-foreground"
      : "text-muted-foreground";

  return (
    <div className="flex items-center gap-2">
      <span
        className={["h-2.5 w-2.5 rounded-full ring-4", dotClass].join(" ")}
        aria-hidden="true"
      />
      <span className={["text-xs font-medium", textClass].join(" ")}>
        {label}
      </span>
    </div>
  );
}
