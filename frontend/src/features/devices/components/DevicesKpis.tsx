import type { DevicesSummaryResponse } from "@/shared/types/device";
import { KpiTile } from "./KpiTiles";

type Props = {
  summary?: DevicesSummaryResponse;
};

export function DevicesKpis({ summary }: Props) {
  const staleMins = summary?.staleMins ?? 60;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      <KpiTile label="Total devices" value={summary?.total ?? 0} />
      <KpiTile label="Online" value={summary?.byStatus?.online ?? 0} />
      <KpiTile label="Offline" value={summary?.byStatus?.offline ?? 0} />
      <KpiTile label="Degraded" value={summary?.byStatus?.degraded ?? 0} />
      <KpiTile label={`Stale ≥ ${staleMins}m`} value={summary?.stale ?? 0} />
    </div>
  );
}
