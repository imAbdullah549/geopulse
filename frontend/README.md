# GeoPulse Frontend

React + TypeScript frontend for GeoPulse (Map, Alerts, Devices).

## Tech stack

- Vite (build/dev server)
- React + React Router
- Redux Toolkit
- Tailwind CSS + Radix UI (shadcn-style primitives)
- MapLibre (map rendering)
- Vitest + Testing Library (tests)
- MSW (API mocking in development)

---

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install & run

```bash
cd frontend
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Environment variables

Env files live in `frontend/` (Vite uses the `VITE_` prefix).

### Development (`.env.development`)

- `VITE_ENABLE_MSW=true` — enable MSW mock APIs in the browser
- `VITE_TELEMETRY_ENABLED=true` — enable frontend telemetry hooks
- `VITE_TELEMETRY_CONSOLE=true` — log telemetry events to console (dev-friendly)

### Test (`.env.test`)

- `VITE_API_BASE_URL=http://localhost/api`
- `VITE_TELEMETRY_ENABLED=false`
- `VITE_TELEMETRY_CONSOLE=false`

Notes:

- When `VITE_ENABLE_MSW=true`, the frontend does not require a backend.
- When MSW is disabled, requests go to `VITE_API_BASE_URL` (or default `/api` if not set).

---

## Scripts

```bash
npm run dev           # start dev server
npm run build         # build TypeScript + production build
npm run lint          # lint
npm run typecheck     # TypeScript check only
npm run test          # vitest (watch)
npm run test:ci       # vitest run
npm run test:ui       # vitest UI
npm run test:coverage # coverage report
```

---

## API mocking (MSW)

MSW lives under:

- `src/mocks/data/` — mock datasets (devices, alerts, map)
- `src/mocks/handlers/` — request handlers per domain
- `src/mocks/browser.ts` — worker setup
- `src/mocks/handlers/index.ts` — handler registry

The service worker is served from `public/` (see the `msw.workerDirectory` setting in `package.json`).

---

## Telemetry (frontend)

Telemetry helpers/hooks live in:

- `src/lib/telemetry.ts`
- `src/lib/hooks/` (error + perf hooks)
- `src/shared/api/telemetry/` (sanitization + shared helpers)

The goal is to capture:

- UI crashes (Error Boundary)
- API/query errors (with safe context)
- basic performance markers (e.g., time to first meaningful content)

Telemetry is controlled via env flags:

- `VITE_TELEMETRY_ENABLED`
- `VITE_TELEMETRY_CONSOLE`

---

## Source layout (high level)

```text
src/
├── app/             # app shell/bootstrap
├── assets/          # static assets
├── components/      # shared UI components
├── features/        # feature modules (Map/Alerts/Devices)
├── lib/             # utilities + hooks (telemetry, pagination, debounce, etc.)
├── mocks/           # MSW data + handlers
├── routes/          # routing configuration/pages
├── shared/          # shared types + api primitives
└── test/            # test utilities/setup
```

---

## Notes

- This project is frontend-first. Backend will be added later.
- Keep telemetry free of sensitive data (PII). Prefer route names, feature area, status codes, and requestId when available.
