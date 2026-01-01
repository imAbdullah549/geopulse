import { baseApi } from "@/shared/api/baseApi";
import type {
  Device,
  DevicesQuery,
  DevicesResponse,
} from "@/shared/types/device";

export const devicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDevices: build.query<DevicesResponse, DevicesQuery>({
      query: (params) => {
        const sp = new URLSearchParams();

        if (params.search) sp.set("search", params.search);

        if (params.status && params.status !== "all") {
          sp.set("status", params.status);
        }

        if (params.severity && params.severity !== "all") {
          sp.set("severity", params.severity);
        }

        sp.set("page", String(params.page ?? 1));
        sp.set("pageSize", String(params.pageSize ?? 20));

        return `devices?${sp.toString()}`;
      },
      providesTags: (res) =>
        res
          ? [
              { type: "Device", id: "LIST" },
              ...res.results.map((d) => ({
                type: "Device" as const,
                id: d.id,
              })),
            ]
          : [{ type: "Device", id: "LIST" }],
    }),

    getDeviceById: build.query<Device, string>({
      query: (id) => `devices/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Device", id }],
    }),
  }),
});

export const { useGetDevicesQuery, useGetDeviceByIdQuery } = devicesApi;
