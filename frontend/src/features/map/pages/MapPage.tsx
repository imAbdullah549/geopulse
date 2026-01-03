import { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

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
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_MAP_FILTERS);
  const [selected, setSelected] = useState<MapPointDto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const params = useMemo(
    () => ({
      severities: filters.severities,
      year: filters.year,
      onlyActive: filters.onlyActive ? true : undefined,
    }),
    [filters]
  );

  const { data, isFetching, isError, refetch } = useGetMapPointsQuery(params);

  const points = data ?? [];

  const tags = useMemo(() => buildFilterTags(filters, setFilters), [filters]);

  const onSelect = (p: MapPointDto) => {
    setSelected(p);
    setDetailsOpen(true);
  };

  return (
    <div className="h-full relative">
      {/* MAP */}
      <MapView points={points} onSelect={onSelect} />

      {/* TOP-RIGHT CONTROLS */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto flex gap-2">
          <FilterDrawer value={filters} onChange={setFilters} />

          <Button
            size="sm"
            variant="secondary"
            onClick={() => refetch()}
            aria-label="Refresh map"
          >
            <RefreshCcw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {isError ? (
          <div className="pointer-events-auto text-xs text-destructive bg-background/90 px-2 py-1 rounded-md">
            Failed to load points
          </div>
        ) : null}
      </div>

      {/* TOP-LEFT ACTIVE FILTER TAGS */}
      {tags.length > 0 ? (
        <div className="absolute left-4 top-4 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <ActiveFilterTags tags={tags} />
          </div>
        </div>
      ) : null}

      {/* BOTTOM-LEFT LEGEND */}
      <div className="absolute left-4 bottom-4 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <MapLegend />
        </div>
      </div>

      {/* DETAILS DRAWER */}
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
