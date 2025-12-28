import "@testing-library/jest-dom/vitest";
import { beforeAll, afterAll, afterEach } from "vitest";
import { server } from "./mswServer";

// Polyfill pointer capture methods and PointerEvent for jsdom so Radix select doesn't throw
// These are no-ops but ensure the methods exist during tests
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof (window as any).PointerEvent === "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (window as any).PointerEvent = class {};
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!HTMLElement.prototype.hasPointerCapture) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HTMLElement.prototype.hasPointerCapture = function () {
    return false;
  };
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!HTMLElement.prototype.setPointerCapture) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HTMLElement.prototype.setPointerCapture = function () {
    /* noop */
  };
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!HTMLElement.prototype.releasePointerCapture) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  HTMLElement.prototype.releasePointerCapture = function () {
    /* noop */
  };
}

// Polyfill scrollIntoView used by Radix in jsdom
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (typeof Element !== "undefined" && !Element.prototype.scrollIntoView) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Element.prototype.scrollIntoView = function () {
    /* noop */
  };
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
