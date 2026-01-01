import { useEffect, useState } from "react";
import DevicesFilters from "../components/DevicesFilters";
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
import { useGetDevicesQuery } from "../api/devicesApi";
import { PaginationBar } from "@/components/pagination";
import { StatusBadge } from "../components/StatusBadge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePagination } from "@/lib/hooks/usePagination";
import { PageShell, PageHeader } from "@/components/page";
import { SeverityBadge } from "../components/SeverityBadge";
import type { DeviceStatus, Severity } from "@/shared/types/device";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useQueryErrorTelemetry } from "@/lib/hooks/useQueryErrorTelemetry";
import { useTimeToFirstContent } from "@/lib/hooks/useTimeToFirstContent";

export function DevicesPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [status, setStatus] = useState<DeviceStatus | "all">("all");
  const [severity, setSeverity] = useState<Severity | "all">("all");

  const [page, setPage] = useState(1);
  const pageSizeDefault = 20;
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, pageSize]);

  const queryArgs = {
    search: debouncedSearch,
    status,
    severity,
    page,
    pageSize,
  };
  const { data, isLoading, isError, isFetching, error, refetch } =
    useGetDevicesQuery(queryArgs);

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
          title="Devices"
          subtitle="Inventory & health overview"
          isUpdating={isFetching}
        />
      }
    >
      <Card className="flex-1 flex-col min-h-0">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <DevicesFilters
            search={search}
            setSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            status={status}
            setStatus={(v) => {
              setStatus(v);
              setPage(1);
            }}
            severity={severity}
            setSeverity={(v) => {
              setSeverity(v);
              setPage(1);
            }}
          />

          <Button
            aria-label="Refresh devices"
            variant="outline"
            disabled={isFetching}
            onClick={() => {
              toast("Refetching devices…");
              refetch();
            }}
          >
            Refresh
          </Button>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col space-y-4 overflow-hidden">
          <div
            className={`flex-1 rounded-md border bg-background overflow-hidden ${
              isFetching ? "opacity-60" : ""
            }`}
          >
            <ScrollArea className="h-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Last seen</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-muted-foreground"
                      >
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : isError ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-10 text-center text-muted-foreground"
                      >
                        {errorMessage}
                      </TableCell>
                    </TableRow>
                  ) : data?.results.length ? (
                    data.results.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.id}</TableCell>
                        <TableCell>{d.name}</TableCell>
                        <TableCell>
                          <StatusBadge status={d.status} />
                        </TableCell>
                        <TableCell>
                          <SeverityBadge severity={d.severity} />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDateTime(d.lastSeenAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No devices found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

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
