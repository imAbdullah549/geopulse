import { baseApi } from "@/shared/api/baseApi";
import type {
  Device,
  DevicesQuery,
  DevicesResponse,
  DeviceHealth,
  DeviceStatus,
  DeviceType,
  Severity,
  DevicesSummaryResponse,
} from "@/shared/types/device";

function setCsv<T extends string>(
  sp: URLSearchParams,
  key: string,
  values?: T[]
) {
  if (!values?.length) return;
  sp.set(key, values.join(","));
}

function setNumber(sp: URLSearchParams, key: string, value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return;
  sp.set(key, String(value));
}

export const devicesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDevices: build.query<DevicesResponse, DevicesQuery | undefined>({
      query: (params = {}) => {
        const sp = new URLSearchParams();

        const search = params.search?.trim();
        if (search) sp.set("search", search);

        setCsv<DeviceType>(sp, "type", params.type);
        setCsv<DeviceStatus>(sp, "status", params.status);
        setCsv<Severity>(sp, "severity", params.severity);
        setCsv<DeviceHealth>(sp, "health", params.health);

        setNumber(sp, "batteryMin", params.batteryMin);
        setNumber(sp, "batteryMax", params.batteryMax);
        setNumber(sp, "staleMins", params.staleMins);

        if (params.orderBy) sp.set("orderBy", params.orderBy);
        if (params.order) sp.set("order", params.order);

        sp.set("page", String(params.page ?? 1));
        sp.set("pageSize", String(params.pageSize ?? 20));

        return {
          url: "devices",
          params: Object.fromEntries(sp.entries()),
        };
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

    getDevicesSummary: build.query<
      DevicesSummaryResponse,
      { staleMins?: number } | undefined
    >({
      query: ({ staleMins } = {}) => {
        const sp = new URLSearchParams();
        if (typeof staleMins === "number")
          sp.set("staleMins", String(staleMins));
        return {
          url: "devices/summary",
          params: Object.fromEntries(sp.entries()),
        };
      },
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useGetDeviceByIdQuery,
  useGetDevicesSummaryQuery,
} = devicesApi;
