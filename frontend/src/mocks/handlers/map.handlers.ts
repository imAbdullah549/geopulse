import { http, HttpResponse } from "msw";
import { maps } from "../data/map.data";

export const mapHandlers = [
  http.get("/api/map/points", ({ request }) => {
    const url = new URL(request.url);

    const severities =
      url.searchParams.get("severities")?.split(",").filter(Boolean) ?? [];
    const yearRaw = url.searchParams.get("year");
    const onlyActive = url.searchParams.get("onlyActive") === "true";

    const year = yearRaw ? Number(yearRaw) : undefined;

    const filtered = maps.filter((p) => {
      if (severities.length && !severities.includes(p.severity)) return false;
      if (year) {
        const y = new Date(p.timestamp).getUTCFullYear();
        if (y !== year) return false;
      }
      if (onlyActive && !(p.status === "open" || p.status === "acknowledged"))
        return false;
      return true;
    });

    return HttpResponse.json(filtered);
  }),
];
