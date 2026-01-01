import { baseApi } from "@/shared/api/baseApi";
import type { MapPointDto, MapPointsParams } from "@/shared/types/map";

function serializeParams(params: MapPointsParams) {
  const query: Record<string, string> = {};
  if (params.severities?.length) query.severities = params.severities.join(",");
  if (params.year) query.year = String(params.year);
  if (params.onlyActive) query.onlyActive = "true";

  return query;
}

export const mapApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMapPoints: build.query<MapPointDto[], MapPointsParams>({
      query: (params) => ({
        url: "/api/map/points",
        params: serializeParams(params),
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "MapPoints" as const, id: "LIST" },
              ...result.map((p) => ({ type: "MapPoints" as const, id: p.id })),
            ]
          : [{ type: "MapPoints" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetMapPointsQuery } = mapApi;
