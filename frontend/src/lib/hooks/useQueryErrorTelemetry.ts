import { useEffect, useRef } from "react";
import { captureException } from "@/lib/telemetry";

type Args = {
  isError: boolean;
  error: unknown;
  meta?: Record<string, unknown>;
};

export function useQueryErrorTelemetry({ isError, error, meta }: Args) {
  // dedupe so we don’t spam telemetry on re-renders
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isError) return;

    const key = JSON.stringify({ error, meta });
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    try {
      captureException(error, meta);
    } catch {
      // swallow telemetry errors
    }
  }, [isError, error, meta]);
}
