import { describe, it, expect } from "vitest";
import { computeBaseUrl } from "./baseApi";

describe("computeBaseUrl", () => {
  it("prefixes /api when no window (Node)", () => {
    expect(computeBaseUrl("/api", {}, false)).toBe("http://localhost/api");
  });

  it("does not prefix in browser", () => {
    expect(computeBaseUrl("/api", {}, true)).toBe("/api");
  });

  it("prefixes when VITEST=true even if window present", () => {
    expect(computeBaseUrl("/api", { VITEST: "true" }, true)).toBe(
      "http://localhost/api"
    );
  });

  it("uses CI/GITHUB_ACTIONS detection to prefix", () => {
    expect(computeBaseUrl("/api", { CI: "true" }, true)).toBe(
      "http://localhost/api"
    );
    expect(computeBaseUrl("/api", { GITHUB_ACTIONS: "true" }, true)).toBe(
      "http://localhost/api"
    );
  });

  it("returns absolute urls unchanged", () => {
    expect(computeBaseUrl("https://api.example.com", {}, false)).toBe(
      "https://api.example.com"
    );
  });
});
