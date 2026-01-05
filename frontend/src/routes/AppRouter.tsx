import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ROUTES } from "@/shared/routes";
import { ErrorBoundary } from "@/components/errors/ErrorBoundary";

const AlertsPage = lazy(() =>
  import("@/features/alerts/pages/AlertsPage").then((m) => ({
    default: m.AlertsPage,
  }))
);

const DevicesPage = lazy(() =>
  import("@/features/devices/pages/DevicesPage").then((m) => ({
    default: m.DevicesPage,
  }))
);

const MapPage = lazy(() =>
  import("@/features/map/pages/MapPage").then((m) => ({ default: m.MapPage }))
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
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route
            path={ROUTES.ROOT}
            element={<Navigate to={ROUTES.ALERTS} replace />}
          />
          <Route
            path={ROUTES.ALERTS}
            element={
              <ErrorBoundary>
                <Lazy>
                  <AlertsPage />
                </Lazy>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.DEVICES}
            element={
              <ErrorBoundary>
                <Lazy>
                  <DevicesPage />
                </Lazy>
              </ErrorBoundary>
            }
          />
          <Route
            path={ROUTES.MAP}
            element={
              <ErrorBoundary>
                <Lazy>
                  <MapPage />
                </Lazy>
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
