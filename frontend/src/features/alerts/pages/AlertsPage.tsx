import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useApiError from "@/lib/hooks/useApiError";
import { memo, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAlertsQuery } from "../api/alertsApi";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { Severity } from "@/shared/types/device";
import type { AlertStatus } from "@/shared/types/alert";
import { PaginationBar } from "@/components/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePagination } from "@/lib/hooks/usePagination";
import { PageShell, PageHeader } from "@/components/page";
import { AlertsFilters } from "../components/AlertsFilters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTimeToFirstContent } from "@/lib/hooks/useTimeToFirstContent";
import { useQueryErrorTelemetry } from "@/lib/hooks/useQueryErrorTelemetry";
import { AlertStatusBadge, SeverityBadge } from "@/components/badges/Badges";

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
        <AlertStatusBadge value={status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDateTime(createdAt)}
      </TableCell>
    </TableRow>
  );
});

export function AlertsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<AlertStatus | "all">("all");

  const [page, setPage] = useState(1);
  const pageSizeDefault = 20;
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const queryArgs = {
    search: debouncedSearch,
    severity,
    status,
    page,
    pageSize,
  };
  const { data, isLoading, isError, isFetching, refetch, error } =
    useGetAlertsQuery(queryArgs);

  const total = data?.count ?? 0;
  const showing = data?.results.length ?? 0;
  const pagination = usePagination({
    total,
    initialPage: page,
    initialPageSize: pageSize,
  });
  const effectivePage = pagination.page;
  const errorMessage = useApiError(error);

  // telemetry hooks
  useQueryErrorTelemetry({ isError, error, meta: { queryArgs } });

  const ready = !isLoading && !isError && !!data;
  useTimeToFirstContent({
    ready,
    metricName: "alerts_time_to_first_table",
    meta: { queryArgs },
  });

  return (
    <PageShell
      header={
        <PageHeader
          title="Alerts"
          subtitle="Alerts overview"
          isUpdating={isFetching}
        />
      }
    >
      <Card className="flex-1 flex-col min-h-0">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <AlertsFilters
            search={search}
            setSearch={setSearch}
            severity={severity}
            setSeverity={(v) => {
              setSeverity(v);
              setPage(1);
            }}
            status={status}
            setStatus={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />

          <Button
            aria-label="Refresh alerts"
            variant="outline"
            disabled={isFetching}
            onClick={() => {
              toast("Refetching alerts…");
              refetch();
            }}
          >
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col space-y-4 overflow-hidden">
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
                isFetching ? "opacity-60" : ""
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

          <PaginationBar
            total={total}
            showing={showing}
            page={effectivePage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            setPage={(p) => {
              setPage(p);
              pagination.setPage(p);
            }}
            setPageSize={(n) => {
              setPageSize(n);
              pagination.setPageSize(n);
              setPage(1);
            }}
            canPrev={pagination.canPrev}
            canNext={pagination.canNext}
          />
        </CardContent>
      </Card>
    </PageShell>
  );
}
