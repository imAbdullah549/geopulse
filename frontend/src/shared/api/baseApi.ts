import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const rawBase = import.meta.env.VITE_API_BASE_URL ?? "/api";
const baseUrl =
  rawBase.startsWith("/") && typeof window === "undefined"
    ? `http://localhost${rawBase}`
    : rawBase;

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Device", "Alert"],
  endpoints: () => ({}),
});
