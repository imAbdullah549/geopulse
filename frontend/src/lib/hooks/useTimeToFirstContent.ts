import { useEffect, useRef } from "react";
import { trackDurationMs } from "@/lib/telemetry";

type Args = {
  ready: boolean;
  metricName: string; // e.g. "devices.time_to_first_table_ms"
  meta?: Record<string, unknown>;
};

export function useTimeToFirstContent({ ready, metricName, meta }: Args) {
  const startRef = useRef<number | null>(null);
  const reportedRef = useRef(false);

  // capture start time once
  useEffect(() => {
    if (startRef.current === null) startRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (!ready || reportedRef.current || startRef.current === null) return;

    reportedRef.current = true;
    const ms = Math.round(performance.now() - startRef.current);

    // Duration/Histogram metric: time until first meaningful content
    trackDurationMs(metricName, ms, meta);
  }, [ready, metricName, meta]);
}
