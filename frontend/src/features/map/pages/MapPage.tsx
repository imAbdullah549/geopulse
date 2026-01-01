import * as React from "react";
import { Button } from "@/components/ui/button";

import type { MapPointDto } from "@/shared/types/map";
import { DEFAULT_MAP_FILTERS, type MapFilters } from "../types";
import { useGetMapPointsQuery } from "../api/mapApi";
import { buildFilterTags } from "../utils/filterTags";
import {
  MapLegend,
  ActiveFilterTags,
  DetailsDrawer,
  FilterDrawer,
  MapView,
} from "../components";

export function MapPage() {
  const [filters, setFilters] = React.useState<MapFilters>(DEFAULT_MAP_FILTERS);
  const [selected, setSelected] = React.useState<MapPointDto | null>(null);
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  const params = React.useMemo(
    () => ({
      severities: filters.severities,
      year: filters.year,
      onlyActive: filters.onlyActive ? true : undefined,
    }),
    [filters]
  );

  const { data, isFetching, isError, refetch } = useGetMapPointsQuery(params);

  const points = data ?? [];
  const tags = React.useMemo(
    () => buildFilterTags(filters, setFilters),
    [filters]
  );

  const onSelect = (p: MapPointDto) => {
    setSelected(p);
    setDetailsOpen(true);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="text-xl font-semibold">Map</h1>

          <div className="flex flex-wrap items-center gap-3">
            {isFetching ? (
              <span className="text-xs text-muted-foreground">Loading…</span>
            ) : null}
            {isError ? (
              <span className="text-xs text-destructive">
                Failed to load points
              </span>
            ) : null}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          </div>

          <ActiveFilterTags tags={tags} />
        </div>

        <FilterDrawer value={filters} onChange={setFilters} />
      </div>

      <div className="min-h-[520px] flex-1 relative">
        <MapView points={points} onSelect={onSelect} />

        {/* Overlay controls */}
        <div className="absolute left-4 bottom-4 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <MapLegend />
          </div>
        </div>
      </div>

      <DetailsDrawer
        point={selected}
        open={detailsOpen}
        onOpenChange={(v) => {
          setDetailsOpen(v);
          if (!v) setSelected(null);
        }}
      />
    </div>
  );
}
