import { baseApi } from "@/shared/api/baseApi";
import type { Alert, AlertStatus } from "@/shared/types/alert";
import type { Severity } from "@/shared/types/device";

export type AlertsQuery = {
  search?: string;
  severity?: Severity | "all";
  status?: AlertStatus | "all";
  page?: number;
  pageSize?: number;
};

export type AlertsResponse = {
  results: Alert[];
  count: number;
  page: number;
  pageSize: number;
};

export const alertsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAlerts: build.query<AlertsResponse, AlertsQuery>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params.search) sp.set("search", params.search);
        if (params.severity && params.severity !== "all")
          sp.set("severity", params.severity);
        if (params.status && params.status !== "all")
          sp.set("status", params.status);
        sp.set("page", String(params.page ?? 1));
        sp.set("pageSize", String(params.pageSize ?? 20));
        return `alerts?${sp.toString()}`;
      },
      providesTags: (res) =>
        res
          ? [
              { type: "Alert", id: "LIST" },
              ...res.results.map((a) => ({ type: "Alert" as const, id: a.id })),
            ]
          : [{ type: "Alert", id: "LIST" }],
    }),

    bulkUpdateAlerts: build.mutation<
      { updated: number },
      { ids: string[]; status: AlertStatus }
    >({
      query: (body) => ({
        url: "alerts/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Alert", id: "LIST" }],
    }),
  }),
});

export const { useGetAlertsQuery, useBulkUpdateAlertsMutation } = alertsApi;
