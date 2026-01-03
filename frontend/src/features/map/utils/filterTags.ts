import type { FilterTag, MapFilters } from "../types";

export function buildFilterTags(
  filters: MapFilters,
  setFilters: (next: MapFilters) => void
): FilterTag[] {
  const tags: FilterTag[] = [];

  if (filters.severities?.length) {
    tags.push({
      key: "severities",
      label: `Severity: ${filters.severities.join(", ")}`,
      onRemove: () => setFilters({ ...filters, severities: undefined }),
    });
  }

  if (filters.year) {
    tags.push({
      key: "year",
      label: `Year: ${filters.year}`,
      onRemove: () => setFilters({ ...filters, year: undefined }),
    });
  }

  if (filters.onlyActive) {
    tags.push({
      key: "onlyActive",
      label: "Only active",
      onRemove: () => setFilters({ ...filters, onlyActive: false }),
    });
  }

  return tags;
}
