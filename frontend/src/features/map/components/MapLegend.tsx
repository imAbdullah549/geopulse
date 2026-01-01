import { Badge } from "@/components/ui/badge";

export function MapLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Legend:</span>
      <Badge variant="outline">Low</Badge>
      <Badge variant="secondary">Medium</Badge>
      <Badge variant="destructive">High</Badge>
    </div>
  );
}
