import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ROUTES } from "@/shared/routes";

const AlertsPage = lazy(() =>
  import("@/features/alerts/AlertsPage").then((m) => ({
    default: m.AlertsPage,
  }))
);

const DevicesPage = lazy(() =>
  import("@/features/devices/DevicesPage").then((m) => ({
    default: m.DevicesPage,
  }))
);

const MapPage = lazy(() =>
  import("@/features/map/MapPage").then((m) => ({ default: m.MapPage }))
);

function NotFound() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="text-muted-foreground mt-2">
        The page you’re looking for doesn’t exist.
      </p>
    </div>
  );
}

function PageFallback() {
  return <div className="p-6 text-muted-foreground">Loading…</div>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route
              path={ROUTES.ROOT}
              element={<Navigate to={ROUTES.ALERTS} replace />}
            />
            <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
            <Route path={ROUTES.DEVICES} element={<DevicesPage />} />
            <Route path={ROUTES.MAP} element={<MapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
}
