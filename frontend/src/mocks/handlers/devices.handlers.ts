import { http, HttpResponse } from "msw";
import { devices } from "../data/devices.data";

export const devicesHandlers = [
  http.get("*/api/devices", ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") ?? "").toLowerCase();
    const status = url.searchParams.get("status"); // online|offline|warning
    const severity = url.searchParams.get("severity"); // low|medium|high
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "20");

    let filtered = [...devices];

    if (search) {
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(search) ||
          d.id.toLowerCase().includes(search)
      );
    }
    if (status) filtered = filtered.filter((d) => d.status === status);
    if (severity) filtered = filtered.filter((d) => d.severity === severity);

    const count = filtered.length;
    const start = (page - 1) * pageSize;
    const results = filtered.slice(start, start + pageSize);

    return HttpResponse.json({ results, count, page, pageSize });
  }),

  http.get("*/api/devices/:id", ({ params }) => {
    const id = String(params.id);
    const found = devices.find((d) => d.id === id);

    if (!found) {
      return HttpResponse.json({ message: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(found);
  }),
];
