import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { AppRouter } from "@/routes/AppRouter";
import "./index.css";

async function enableMocking() {
  const enable = import.meta.env.VITE_ENABLE_MSW === "true";
  if (!import.meta.env.DEV || !enable) return;

  const { worker } = await import("@/mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <AppRouter />
      </Provider>
    </React.StrictMode>
  );
});
