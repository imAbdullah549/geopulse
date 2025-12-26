import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app", () => {
  render(<App />);
  // Update this text to match your UI if needed
  expect(screen.getByText(/vite \+ react/i)).toBeInTheDocument();
});
