import { useEffect, useRef } from "react";
import { captureMetric } from "@/lib/telemetry";

type Args = {
  ready: boolean;
  metricName: string;
  meta?: Record<string, unknown>;
};

export function useTimeToFirstContent({ ready, metricName, meta }: Args) {
  const startRef = useRef<number | null>(null);
  const reportedRef = useRef(false);

  useEffect(() => {
    if (startRef.current === null) startRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!ready || reportedRef.current || !startRef.current) return;

    reportedRef.current = true;
    const duration = Date.now() - startRef.current;

    try {
      captureMetric(metricName, duration, meta);
    } catch {
      // swallow telemetry errors
    }
  }, [ready, metricName, meta]);
}
