import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { AlertsPage } from "@/features/alerts/AlertsPage";

function MapPlaceholder() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Map (coming next)</h1>
      <p className="text-muted-foreground mt-2">
        We’ll build MapLibre view after Alerts is complete.
      </p>
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/alerts" replace />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/map" element={<MapPlaceholder />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
