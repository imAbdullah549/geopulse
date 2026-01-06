# Contributing to GeoPulse

GeoPulse is an ops-focused portfolio project. Contributions, suggestions, and bug reports are welcome.

## Scope (current)

- The repo is currently **frontend-first**.
- APIs are mocked using **MSW** in development.
- `backend/` will be added later.

## Repository structure

- `frontend/` — React + TypeScript app (Map, Alerts, Devices)
- `docs/` — cross-cutting docs (observability, conventions, runbooks)
- `backend/` — planned

## Local development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

> Use a single package manager per repo. This project currently uses `npm` (`package-lock.json`).

## API mocking (MSW)

- MSW handlers and mock data live in `frontend/src/mocks/`.
- MSW behavior is controlled via Vite env flags (see `frontend/.env.*`).

## Branch naming

- `feature/<scope>` — new functionality
- `fix/<scope>` — bug fixes
- `chore/<scope>` — refactors/tooling/cleanup
- `docs/<scope>` — documentation

Examples:

- `feature/devices-page-v2`
- `fix/filter-reset-draft-state`
- `chore/telemetry-cleanup`
- `docs/observability`

## Commit message style

Prefer conventional commits with a scope:

- `feat(devices): add KPI tiles and row cues`
- `fix(filters): reset draft state before apply`
- `chore(telemetry): attach requestId to error events`
- `docs: add contributing guide`

## Pull request guidelines

Before opening a PR:

- Keep changes focused (one feature/fix per PR).
- Ensure the app runs locally and the main flows work (Map, Alerts, Devices).
- Include screenshots for UI changes.
- Avoid introducing heavy dependencies unless clearly justified.

### PR checklist

- [ ] App runs locally (`npm run dev`)
- [ ] Lint passes (`npm run lint`) if relevant
- [ ] Tests updated/added when needed (`npm run test:ci`)
- [ ] No sensitive data (PII/secrets) in logs, mocks, or telemetry
- [ ] UI changes include screenshots

## Code quality expectations

- Prefer TypeScript-first, strongly typed APIs and UI models.
- Keep components small and composable.
- Use custom hooks for reusable logic (data fetching, pagination, telemetry).
- Add error handling and telemetry where it improves debuggability.
- Do not include sensitive data (PII) in logs or telemetry.

## Reporting issues

When reporting a bug, include:

- expected vs actual behavior
- steps to reproduce
- browser/device
- screenshots (if UI-related)
- console/network errors (redact any sensitive values)
