import { describe, it, expect } from "vitest";
import { getApiErrorMessage } from "./useApiError";

describe("getApiErrorMessage", () => {
  it("returns Unknown error for null/undefined", () => {
    expect(getApiErrorMessage(null)).toBe("Unknown error");
    expect(getApiErrorMessage(undefined)).toBe("Unknown error");
  });

  it("returns string errors", () => {
    expect(getApiErrorMessage("Plain error")).toBe("Plain error");
  });

  it("returns message from fetch error with error field", () => {
    const err = { status: 429, error: "Rate limited" } as any;
    expect(getApiErrorMessage(err)).toBe("Rate limited");
  });

  it("returns string body from fetch error data", () => {
    const err = { status: 500, data: "Plain error" } as any;
    expect(getApiErrorMessage(err)).toBe("Plain error");
  });

  it("returns message from fetch error data object", () => {
    const err = { status: 500, data: { message: "DB is down" } } as any;
    expect(getApiErrorMessage(err)).toBe("DB is down");
  });

  it("returns message property for Error-like objects", () => {
    const err = new Error("Network failure");
    expect(getApiErrorMessage(err)).toBe("Network failure");
  });

  it("returns serialized error message", () => {
    const err = { message: "serialized" } as any;
    expect(getApiErrorMessage(err)).toBe("serialized");
  });
});
