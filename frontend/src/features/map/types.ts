import type { MapPointDto, MapPointsParams } from "@/shared/types/map";

export type MapFilters = Required<Pick<MapPointsParams, "onlyActive">> &
  Pick<MapPointsParams, "severities" | "year">;

export const DEFAULT_MAP_FILTERS: MapFilters = {
  severities: undefined,
  year: undefined,
  onlyActive: false,
};

export type FilterTag = {
  key: string;
  label: string;
  onRemove: () => void;
};

export type SelectedPoint = MapPointDto | null;
