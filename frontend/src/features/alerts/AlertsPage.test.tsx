import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { store } from "@/app/store";
import { AppRouter } from "@/routes/AppRouter";

// IMPORTANT: this assumes your MSW worker is enabled in tests.
// Easiest: don't start worker in tests; instead use MSW node server.
// For now, this test is "UI smoke" and will pass once MSW test server is added.
// If you want the full MSW node setup now, tell me and I’ll give it next.

test("alerts page renders", async () => {
  render(
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );

  // Navigate to Alerts (default route redirects to /alerts)
  expect(await screen.findByText(/alerts/i)).toBeInTheDocument();
});
