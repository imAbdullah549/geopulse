import { memo, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { captureException, captureMetric } from "@/lib/telemetry";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useGetAlertsQuery } from "./alertsApi";
import type { Severity } from "@/shared/types/device";
import type { AlertStatus } from "@/shared/types/alert";
import useApiError from "@/lib/hooks/useApiError";
import { ScrollArea } from "@/components/ui/scroll-area";

import { SeverityBadge, StatusBadge } from "./Badges";
import { AlertsFilters } from "./AlertsFilters";
import { AlertsPagination } from "./AlertsPagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { usePagination } from "@/lib/hooks/usePagination";

type AlertRowProps = {
  title: string;
  deviceId: string;
  severity: Severity;
  status: AlertStatus;
  createdAt: string;
};

const AlertRow = memo(function AlertRow({
  title,
  deviceId,
  severity,
  status,
  createdAt,
}: AlertRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{title}</TableCell>
      <TableCell>{deviceId}</TableCell>
      <TableCell>
        <SeverityBadge value={severity} />
      </TableCell>
      <TableCell>
        <StatusBadge value={status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(createdAt).toLocaleString()}
      </TableCell>
    </TableRow>
  );
});

export function AlertsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<AlertStatus | "all">("all");
  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    canPrev,
    canNext,
    setTotal,
  } = usePagination(1, 20);

  const queryArgs = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      severity: severity === "all" ? undefined : severity,
      status: status === "all" ? undefined : status,
      page,
      pageSize,
    }),
    [debouncedSearch, severity, status, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, severity, status, pageSize, setPage]);

  const { data, isLoading, isError, isFetching, refetch, error } =
    useGetAlertsQuery(queryArgs);

  // keep hook informed of latest total count from response
  useEffect(() => {
    setTotal(data?.count ?? 0);
  }, [data?.count, setTotal]);

  const errorMessage = useApiError(error);

  // Report API errors (lightweight telemetry hook) so we can observe failures in prod
  useEffect(() => {
    if (isError) {
      try {
        captureException(error, { queryArgs });
      } catch (e) {
        // swallow telemetry failures
      }
    }
  }, [isError, error, queryArgs]);

  // Measure time to first table render for performance monitoring
  const pageLoadStartRef = useRef<number | null>(null);
  const ttfReportedRef = useRef(false);

  useEffect(() => {
    // start timer on first mount
    if (pageLoadStartRef.current === null)
      pageLoadStartRef.current = Date.now();
  }, []);

  useEffect(() => {
    // when table is visible, capture time-to-first-table once
    const hasTable = !isLoading && !isError && !!data;
    if (hasTable && !ttfReportedRef.current && pageLoadStartRef.current) {
      const duration = Date.now() - pageLoadStartRef.current;
      ttfReportedRef.current = true;
      try {
        captureMetric("time_to_first_table", duration, { queryArgs });
      } catch (e) {
        // ignore telemetry errors
      }
    }
  }, [isLoading, pageLoadStartRef]);

  const total = data?.count ?? 0;

  return (
    <div className="h-full p-4">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Alerts
            {isFetching && (
              <span
                className="text-sm text-muted-foreground"
                aria-live="polite"
              >
                Updating…
              </span>
            )}
          </CardTitle>
          <Button
            aria-label="Refresh alerts"
            variant="outline"
            onClick={() => {
              toast("Refetching alerts…");
              refetch();
            }}
          >
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col space-y-4 overflow-hidden">
          {/* Filters */}
          <AlertsFilters
            search={search}
            setSearch={setSearch}
            severity={severity}
            setSeverity={setSeverity}
            status={status}
            setStatus={setStatus}
          />

          {/* Content */}
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : isError ? (
            <div className="rounded-md border bg-background p-4">
              <div className="font-medium">Failed to load alerts</div>
              <div className="text-sm text-muted-foreground mt-1">
                {errorMessage}
              </div>
              <Button
                className="mt-3"
                onClick={() => refetch()}
                aria-label="Retry fetching alerts"
              >
                Retry
              </Button>
            </div>
          ) : (
            <div
              className={`flex-1 rounded-md border bg-background overflow-hidden ${
                isFetching ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <ScrollArea className="h-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.results.length ? (
                      data.results.map((a) => (
                        <AlertRow
                          key={a.id}
                          title={a.title}
                          deviceId={a.deviceId}
                          severity={a.severity}
                          status={a.status}
                          createdAt={a.createdAt}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-8 text-center text-muted-foreground"
                        >
                          No alerts found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
          <AlertsPagination
            total={total}
            showing={data?.results.length ?? 0}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            canPrev={canPrev}
            canNext={canNext}
          />
        </CardContent>
      </Card>
    </div>
  );
}
