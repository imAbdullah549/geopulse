# Observability & Telemetry (GeoPulse)

GeoPulse aims to reduce time-to-debug by making failures traceable from UI → API → backend logs.

> Current status: backend is not implemented yet. Frontend uses MSW for mocked APIs.

---

## Where telemetry lives (implementation)

Telemetry code lives in the frontend:

- `frontend/src/lib/telemetry.ts`
- `frontend/src/lib/hooks/`
- `frontend/src/shared/api/telemetry/`

This `docs/` folder contains documentation and future runbooks only.

---

## Goals

We want to be able to answer:

- What failed, where, and why?
- Who is impacted (how many users/sessions, which route)?
- Is it getting worse after a deploy?
- Can we reproduce quickly (same route + params + requestId)?

---

## What we capture today (frontend)

### UI reliability

- **UI crashes** via Error Boundaries (unexpected render/runtime exceptions).
  - Captures safe context like `componentStack`.
  - Telemetry is wrapped so it never breaks the app if telemetry fails.

### API and network reliability

- **API/query errors** with safe context (route + query params) to reproduce failures.
- Centralized network telemetry for all RTK Query requests (see below).

### UX performance

- **Time to first meaningful content** per screen (e.g., Devices table render) using a dedicated hook.
  - Example metric: `devices_time_to_first_table`
  - Optional metadata: current query args/filters (sanitized/redacted as needed)

> Data safety: do not include PII in telemetry. Prefer coarse identifiers and redacted payloads.

### Network telemetry (RTK Query baseQuery)

All API/network telemetry is captured centrally in the RTK Query `baseQuery` wrapper. This gives us consistent request metrics and error visibility across the app without duplicating logic per endpoint.

Captured signals:

- **Request counter:** `net.request` (one event per API call)
- **Response duration:** `net.response_ms` (timing per call; useful for latency tracking and p95/p99 later)
- **Error counter:** `net.error` (one event per failed call)
- **Exceptions:** captured once centrally with safe context for debugging

Captured context (safe / non-PII):

- `endpoint` (RTK Query endpoint name)
- `type` (`query` or `mutation`)
- HTTP `method`
- `urlPath` (path only; query string excluded)
- `status` (HTTP status when available)
- `requestId` (client-generated for frontend correlation; server `x-request-id` planned)

Query parameter safety:

- Only **allowlisted** params per endpoint are included.
- Params are **sanitized** to avoid leaking sensitive values.

---

## requestId (planned backend contract)

Backend should emit a `requestId` / `x-request-id` so one user action can be correlated across:

- frontend telemetry (error/perf events)
- API gateway/backend logs
- background jobs/workers

This enables: “user saw an error” → “search logs by requestId” → “find root cause”.

---

## Planned next steps

### Metrics

- API success rate / error rate per endpoint
- latency percentiles (p50/p95/p99)
- timeout rate and retry rate

### Performance

- initial page load metrics per route
- time-to-first-content per route
- slow render detection (selectively)

### Product events (safe, non-PII)

- filter apply/reset
- pagination/sorting
- empty states vs results

---

## Event conventions (recommended)

Keep telemetry consistent and searchable:

- Use stable names: `devices.filters.apply`, `alerts.list.fetch_error`, `map.render.time_to_first_content`
- Include minimal context: `route`, `feature`, `statusCode`, `requestId` (when available)
- Avoid dynamic strings in names (put variable info in fields instead)

---

## Debugging playbook (starter)

When something breaks:

1. Check frontend telemetry for the route and error type.
2. If present, use `requestId` to jump to backend/API logs (future).
3. Verify if the issue correlates with a recent change (deploy/version).
4. Add missing telemetry where it would reduce time-to-debug next time.

---

## Data safety (rules)

- Never log passwords, tokens, emails, phone numbers, or full payloads that may include PII.
- Prefer: route name, feature area, error type, status code, requestId, and redacted params.

---

## Tooling (placeholder)

Telemetry is currently developer-focused (console/debugging). When integrating a backend/collector,
this doc should be updated with links to dashboards and error tracking.
