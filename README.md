# GeoPulse

GeoPulse is an ops-focused platform for monitoring field devices and operational events on a map.
It helps teams detect issues early and respond faster with a fast UI (Map, Alerts, Devices) and
observability/telemetry designed to reduce time-to-debug (UI → API → backend logs).

> Monorepo: this README is repo-level. For setup and feature details, see the service READMEs linked below.

---

## Observability & telemetry

GeoPulse is built to make failures traceable and debugging faster — from UI → API → backend logs.

### What we capture today

- **UI crashes** via Error Boundaries (so one broken component doesn’t take the app down).
- **API/query errors** with safe context (route + query params) to reproduce failed requests.
- **Performance marker:** time to first meaningful content (e.g., until the Devices table renders).
- **Network request telemetry** (centralized): request count, response duration, and error count for RTK Query calls.

### Why `requestId` matters

Backend should emit a `requestId` / `x-request-id` so a single user action can be correlated across:

- frontend telemetry (error/perf events)
- API gateway/backend logs
- background jobs/workers

This is how we go from “user saw an error” → “exact request in logs” quickly.

### What we plan to add next

- **API reliability metrics:** success rate, error rate by endpoint, latency buckets.
- **Page performance:** initial load, time-to-first-content, slow query detection per page.
- **User interaction events** (safe, non-PII): filter apply/reset, pagination, sort changes.
- **Component-level performance** (selectively): slow renders and expensive UI paths.

See: [`docs/observability.md`](docs/observability.md).

---

## Product areas

### Map (Operations view)

- Visualize devices and events geographically for rapid situational awareness
- Filter by operational dimensions (e.g., severity, status, time range) to focus on what matters
- Drill into details via drawers/panels for investigation and triage

### Alerts

- Track alert lifecycle (new → acknowledged → resolved)
- Filter and segment alerts by severity/status and other operational dimensions
- Badge-driven UI for fast scanning and prioritization

### Devices

- List and triage devices using health cues (status, staleness, battery, health)
- KPI tiles for quick summary and situational awareness
- Filters with “draft → apply” UX to avoid noisy refetching while selecting options

---

## Repository structure

```text
.
├── .github/
│   └── workflows/         # CI workflows
├── frontend/              # React + TypeScript app (Map, Alerts, Devices)
├── docs/                  # Observability docs, conventions
├── backend/               # Placeholder (planned Django/Celery services)
├── README.md              # You are here
├── .editorconfig
└── .gitignore
```

**Current status**

- Backend is planned. For now, the frontend uses **MSW** for API mocking.

---

## Documentation

- Frontend: [`frontend/README.md`](frontend/README.md). 
- Observability & telemetry: [`docs/observability.md`](docs/observability.md). 
- Contributing: [`docs/contributing.md`](docs/contributing.md). 
- Backend (planned): `backend/README.md`

---

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Engineering conventions

### Branch naming

- `feature/<scope>` — new functionality
- `fix/<scope>` — bug fixes
- `chore/<scope>` — refactors/tooling/cleanup
- `docs/<scope>` — documentation

Examples:

- `feature/map-filter-drawer`
- `feature/alerts-table-improvements`
- `feature/devices-page-v2`
- `fix/filter-reset-draft-state`

### Commit messages

Examples:

- `feat(map): add filter drawer and active states`
- `feat(alerts): improve table filters and badges`
- `feat(devices): add KPI tiles and row cues`
- `chore(telemetry): enrich errors with requestId`

---

## License

MIT
