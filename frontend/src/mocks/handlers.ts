import type { Alert } from "@/shared/types/alert";
import { http, HttpResponse } from "msw";

// keep your existing devices mock if you have it...

const alerts: Alert[] = Array.from({ length: 80 }, (_, i) => ({
  id: `al-${i + 1}`,
  deviceId: `dev-${(i % 50) + 1}`,
  title: i % 3 === 0 ? "Battery low" : "Temperature high",
  severity: i % 7 === 0 ? "high" : i % 3 === 0 ? "medium" : "low",
  status: i % 6 === 0 ? "acknowledged" : "open",
  createdAt: new Date(Date.now() - i * 5 * 60_000).toISOString(),
}));

export const handlers = [
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
