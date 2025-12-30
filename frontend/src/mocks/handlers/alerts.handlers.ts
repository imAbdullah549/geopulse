import { http, HttpResponse } from "msw";
import { alerts } from "../data/alerts.data";

export const alertsHandlers = [
  http.get("*/api/alerts", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").toLowerCase();
    const severity = url.searchParams.get("severity"); // low|medium|high
    const status = url.searchParams.get("status"); // open|acknowledged|resolved
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "20");

    let filtered = [...alerts];

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(search) ||
          a.deviceId.toLowerCase().includes(search)
      );
    }
    if (severity) filtered = filtered.filter((a) => a.severity === severity);
    if (status) filtered = filtered.filter((a) => a.status === status);

    const count = filtered.length;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ results, count, page, pageSize });
  }),

  http.post("*/api/alerts/bulk", async ({ request }) => {
    const body = (await request.json()) as { ids: string[]; status: string };
    // mock response only (we’ll implement real mutation behavior later)
    return HttpResponse.json({ updated: body.ids.length });
  }),
];
