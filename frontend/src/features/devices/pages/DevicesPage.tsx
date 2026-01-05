import { useMemo, useState } from "react";
import useApiError from "@/lib/hooks/useApiError";
import {
  useGetDevicesQuery,
  useGetDevicesSummaryQuery,
} from "../api/devicesApi";
import { PaginationBar } from "@/components/pagination";
import { usePagination } from "@/lib/hooks/usePagination";
import { PageShell, PageHeader } from "@/components/page";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTimeToFirstContent } from "@/lib/hooks/useTimeToFirstContent";
import { DevicesTable } from "../components/DevicesTable";
import { DevicesKpis } from "../components/DevicesKpis";
import type { DevicesFiltersValue } from "../components/Filters/types";
import { DevicesFiltersBar } from "../components/Filters/DevicesFiltersBar";

const DEFAULT_FILTERS: DevicesFiltersValue = {
  search: "",
  orderBy: "lastPingAt",
  order: "desc",
};

export function DevicesPage() {
  const [filters, setFilters] = useState<DevicesFiltersValue>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const queryArgs = useMemo(
    () => ({
      ...filters,
      page,
      pageSize,
    }),
    [filters, page, pageSize]
  );

  const { data, isLoading, isError, isFetching, error } =
    useGetDevicesQuery(queryArgs);

  const { data: summary } = useGetDevicesSummaryQuery({
    staleMins: filters.staleMins ?? 60,
  });

  const total = data?.count ?? 0;
  const showing = data?.results.length ?? 0;

  const pagination = usePagination({ total, page, pageSize });

  const errorMessage = useApiError(error);

  const ready = !isLoading && !isError && !!data;
  useTimeToFirstContent({
    ready,
    metricName: "devices_time_to_first_table",
    meta: queryArgs,
  });

  const staleThreshold = filters.staleMins ?? 60;

  return (
    <PageShell
      header={
        <PageHeader
          title="Devices"
          subtitle="Inventory & health overview"
          isUpdating={isFetching}
          kpis={<DevicesKpis summary={summary} />}
        />
      }
    >
      <Card className="flex-1 flex-col min-h-0">
        <CardHeader className="space-y-3">
          <DevicesFiltersBar
            value={filters}
            disabled={isFetching}
            onApply={(next) => {
              setFilters(next);
              setPage(1);
            }}
            onReset={() => {
              setFilters(DEFAULT_FILTERS);
              setPage(1);
            }}
          />
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col space-y-4 overflow-hidden">
          <DevicesTable
            data={data}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
            isFetching={isFetching}
            staleThreshold={staleThreshold}
          />

          <PaginationBar
            total={total}
            showing={showing}
            page={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={(n) => {
              setPageSize(n);
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
