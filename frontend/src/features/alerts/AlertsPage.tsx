import { memo, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { Alert, AlertStatus } from "@/shared/types/alert";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { ScrollArea } from "@/components/ui/scroll-area";

import { SeverityBadge, StatusBadge } from "./Badges";
import { AlertsFilters } from "./AlertsFilters";
import { useDebounce } from "@/lib/hooks/useDebounce";

const AlertRow = memo(function AlertRow({ a }: { a: Alert }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{a.title}</TableCell>
      <TableCell>{a.deviceId}</TableCell>
      <TableCell>
        <SeverityBadge value={a.severity} />
      </TableCell>
      <TableCell>
        <StatusBadge value={a.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(a.createdAt).toLocaleString()}
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
  const [pageSize, setPageSize] = useState(20);

  const queryArgs = useMemo(
    () => ({
      search: debouncedSearch.trim() || undefined,
      severity,
      status,
      page,
      pageSize,
    }),
    [debouncedSearch, severity, status, page, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, severity, status, pageSize]);

  const { data, isLoading, isError, isFetching, refetch, error } =
    useGetAlertsQuery(queryArgs);

  const isFetchError = (e: unknown): e is FetchBaseQueryError =>
    typeof e === "object" && e !== null && "status" in e;

  const getErrorMessage = (err: unknown): string => {
    if (!err) return "Unknown error";
    if (typeof err === "string") return err;

    // RTK Query "fetch" error
    if (isFetchError(err)) {
      // error can be { status, data } or { error: string }
      if ("error" in err && typeof (err as any).error === "string")
        return (err as any).error;

      const data = (err as FetchBaseQueryError).data;
      if (data) {
        if (typeof data === "string") return data;
        if (typeof (data as any).message === "string")
          return (data as any).message;
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
  };

  const errorMessage = getErrorMessage(error);

  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="h-full p-4">
      <Card className="h-full flex">
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

        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
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
                      data.results.map((a) => <AlertRow key={a.id} a={a} />)
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
          <div className="shrink-0 flex flex-col gap-2  text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div>
              Total: {total} • Showing: {data?.results.length ?? 0}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows:</span>

              <Select
                value={String(pageSize)}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger className="w-[90px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!canPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>

              <div className="min-w-[120px] text-center">
                Page <span className="font-medium text-foreground">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={!canNext}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
