import { useMemo, useState } from "react";
import DevicesFilters from "./DevicesFilters";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AlertsPagination from "@/features/alerts/AlertsPagination"; // reuse your existing pagination component
import type { DeviceStatus, Severity } from "@/shared/types/device";
import { useGetDevicesQuery } from "./devicesApi";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { SeverityBadge } from "./SeverityBadge";

export function DevicesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<DeviceStatus | "all">("all");
  const [severity, setSeverity] = useState<Severity | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const queryArgs = useMemo(
    () => ({ search, status, severity, page, pageSize }),
    [search, status, severity, page, pageSize]
  );

  const { data, isLoading, isError, refetch, isFetching } =
    useGetDevicesQuery(queryArgs);

  const total = data?.count ?? 0;
  const showing = data?.results.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="h-full p-4 space-y-4 flex flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Devices
          </h2>
          <p className="text-sm text-muted-foreground">
            Inventory & health overview
            {isFetching ? " • Updating…" : null}
          </p>
        </div>
      </div>
      <Card className="flex-1 flex-col min-h-0">
        <CardHeader className="flex flex-row items-center justify-between">
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
          <div
            className={`flex-1 rounded-md border bg-background overflow-hidden ${
              isFetching ? "opacity-60 pointer-events-none" : ""
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
                        Failed to load devices.
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
                          {new Date(d.lastSeenAt).toLocaleString()}
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

          <AlertsPagination
            total={total}
            showing={showing}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={(n) => {
              setPageSize(n);
              setPage(1);
            }}
            canPrev={page > 1}
            canNext={page < totalPages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
