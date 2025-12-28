import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/testUtils";
import { AlertsPage } from "./AlertsPage";
import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/mswServer";

test("renders alerts rows", async () => {
  renderWithProviders(<AlertsPage />);

  // Table is present
  expect(await screen.findByRole("table")).toBeInTheDocument();

  const cells = await screen.findAllByText(/battery low|temperature high/i);
  expect(cells.length).toBeGreaterThan(0);
});

test("renders first page of alerts (20 rows)", async () => {
  renderWithProviders(<AlertsPage />);

  const table = await screen.findByRole("table");
  const rows = within(table).getAllByRole("row");

  // 1 header row + 20 body rows
  expect(rows.length).toBe(21);
});

test("next page loads page 2", async () => {
  const user = userEvent.setup();
  renderWithProviders(<AlertsPage />);

  await screen.findByRole("table");

  await user.click(screen.getByRole("button", { name: /next page/i }));

  expect(await screen.findByLabelText(/page indicator/i)).toHaveTextContent(
    "Page 2 of"
  );
});

test("changing rows per page to 50 shows 50 alerts", async () => {
  const user = userEvent.setup();
  renderWithProviders(<AlertsPage />);

  await screen.findByRole("table");

  const trigger = await screen.findByLabelText("Rows per page");
  await user.click(trigger);

  // Select 50
  await user.click(await screen.findByRole("option", { name: "50" }));

  // Now table should have 1 header row + 50 body rows
  const updatedTable = await screen.findByRole("table");
  const rows = within(updatedTable).getAllByRole("row");
  expect(rows.length).toBe(51);
});

test("filter by severity = High shows only High severity and does not increase results", async () => {
  const user = userEvent.setup();
  renderWithProviders(<AlertsPage />);

  // Wait for initial table (includes header)
  const table = await screen.findByRole("table");
  const initialRows = within(table).getAllByRole("row").length;
  const initialBodyRows = Math.max(0, initialRows - 1);

  // Open severity filter and choose High
  await user.click(screen.getByLabelText(/filter by severity/i));
  await user.click(await screen.findByRole("option", { name: /High/i }));

  // Wait for table to update
  const updatedTable = await screen.findByRole("table");
  const bodyRows = within(updatedTable).getAllByRole("row").slice(1); // exclude header
  const updatedBodyRows = bodyRows.length;

  // Every visible row (if any) should have severity "High"
  for (const row of bodyRows) {
    expect(within(row).getByText(/^High$/i)).toBeInTheDocument();
  }

  // Number of body rows should not increase
  expect(updatedBodyRows).toBeLessThanOrEqual(initialBodyRows);
});

test("filter by status = Acknowledged updates results", async () => {
  const user = userEvent.setup();
  renderWithProviders(<AlertsPage />);

  const table = await screen.findByRole("table");
  const initialRows = within(table).getAllByRole("row").length;
  const initialBodyRows = Math.max(0, initialRows - 1);

  await user.click(screen.getByLabelText(/filter by status/i));
  await user.click(await screen.findByRole("option", { name: "Acknowledged" }));

  // Wait for table to update
  const updatedTable = await screen.findByRole("table");
  const bodyRows = within(updatedTable).getAllByRole("row").slice(1); // exclude header
  const updatedBodyRows = bodyRows.length;

  for (const row of bodyRows) {
    expect(within(row).getByText(/^Acknowledged$/i)).toBeInTheDocument();
  }
  // Just confirm table still renders after filter update
  expect(await screen.findByRole("table")).toBeInTheDocument();
  // Number of body rows should not increase
  expect(updatedBodyRows).toBeLessThanOrEqual(initialBodyRows);
});

test("search filters results (debounced)", async () => {
  // Use real timers here; we wait for the UI to update after debounce
  const user = userEvent.setup();

  renderWithProviders(<AlertsPage />);
  await screen.findByRole("table");

  // capture initial body row count
  const initialTable = await screen.findByRole("table");
  const initialBodyRows = Math.max(
    0,
    within(initialTable).getAllByRole("row").length - 1
  );

  const input = screen.getByLabelText(/search alerts/i);
  await user.clear(input);
  await user.type(input, "dev-1");

  // Wait for the table to update and contain a device cell with the search term
  const updatedTable = await screen.findByRole("table");
  await within(updatedTable).findAllByText(/dev-1/i);

  // Now table should update with filtered results
  const bodyRows = within(updatedTable).getAllByRole("row").slice(1); // exclude header

  // At least one result should be visible for this mock data
  expect(bodyRows.length).toBeGreaterThan(0);

  // At least one visible row should contain the search term in the device column
  const hasMatch = bodyRows.some((row) => !!within(row).queryByText(/dev-1/i));
  expect(hasMatch).toBe(true);

  // Number of body rows should not increase
  expect(bodyRows.length).toBeLessThanOrEqual(initialBodyRows);
});

test("shows error state when api fails", async () => {
  server.use(
    http.get("*/api/alerts", () => HttpResponse.json({}, { status: 500 }))
  );

  renderWithProviders(<AlertsPage />);

  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
});

test("displays backend error 'message' field when provided", async () => {
  server.use(
    http.get("*/api/alerts", () =>
      HttpResponse.json({ message: "DB is down" }, { status: 500 })
    )
  );

  renderWithProviders(<AlertsPage />);

  expect(await screen.findByText(/db is down/i)).toBeInTheDocument();
});

test("displays backend string body when provided", async () => {
  server.use(
    http.get("*/api/alerts", () =>
      HttpResponse.json("Plain error", { status: 500 })
    )
  );

  renderWithProviders(<AlertsPage />);

  expect(await screen.findByText(/plain error/i)).toBeInTheDocument();
});

test("displays error field from fetch error object", async () => {
  server.use(
    http.get("*/api/alerts", () =>
      HttpResponse.json({ error: "Rate limited" }, { status: 429 })
    )
  );

  renderWithProviders(<AlertsPage />);

  expect(await screen.findByText(/rate limited/i)).toBeInTheDocument();
});

test("displays network error when fetch throws", async () => {
  server.use(
    http.get("*/api/alerts", () => {
      throw new Error("Network failure");
    })
  );

  renderWithProviders(<AlertsPage />);

  expect(await screen.findByText(/network failure/i)).toBeInTheDocument();
});

test("retry refetch recovers and shows table on success", async () => {
  const user = userEvent.setup();

  // initial failure
  server.use(
    http.get("*/api/alerts", () => HttpResponse.json({}, { status: 500 }))
  );

  renderWithProviders(<AlertsPage />);

  expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();

  // now make the next response succeed
  server.use(
    http.get("*/api/alerts", ({ request }) => {
      const url = new URL(request.url);
      const page = Number(url.searchParams.get("page") ?? "1");
      return HttpResponse.json({ results: [], count: 0, page, pageSize: 20 });
    })
  );

  await user.click(screen.getByRole("button", { name: /retry/i }));

  // table should appear (even if empty body)
  expect(await screen.findByRole("table")).toBeInTheDocument();
});
