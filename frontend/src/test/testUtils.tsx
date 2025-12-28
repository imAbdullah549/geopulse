import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { baseApi } from "@/shared/api/baseApi";

export function makeStore() {
  return configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (gDM) => gDM().concat(baseApi.middleware),
  });
}

export function renderWithProviders(ui: React.ReactElement, route = "/alerts") {
  const store = makeStore();
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>
  );
}
