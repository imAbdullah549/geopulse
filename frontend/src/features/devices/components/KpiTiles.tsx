import { Card, CardContent } from "@/components/ui/card";

export function KpiTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className="shadow-none p-0">
      <CardContent className="p-3 flex items-center gap-4">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
