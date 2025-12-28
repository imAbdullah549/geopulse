import { useMemo } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

const isFetchError = (e: unknown): e is FetchBaseQueryError =>
  typeof e === "object" && e !== null && "status" in e;

export function getApiErrorMessage(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;

  if (isFetchError(err)) {
    // error can be { status, data } or { error: string }
    if ("error" in err && typeof (err as any).error === "string")
      return (err as any).error;

    const data = (err as FetchBaseQueryError).data;
    if (data) {
      if (typeof data === "string") return data;
      if (typeof (data as any).message === "string")
        return (data as any).message;
      if (typeof (data as any).error === "string") return (data as any).error;
    }
  }

  // Serialized errors or plain Error-like objects
  if (typeof err === "object" && err !== null && "message" in (err as any)) {
    const msg = (err as any).message;
    if (typeof msg === "string") return msg;
  }

  const serializedMessage = (err as SerializedError).message;
  if (typeof serializedMessage === "string") return serializedMessage;

  return "Unknown error";
}

export default function useApiError(err: unknown): string {
  return useMemo(() => getApiErrorMessage(err), [err]);
}
