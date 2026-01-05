import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { DevicesResponse } from "@/shared/types/device";
import { DeviceRow } from "./DeviceRow";

type DevicesTableProps = {
  data?: DevicesResponse;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isFetching?: boolean;
  staleThreshold: number;
};

export function DevicesTable({
  data,
  isLoading,
  isError,
  errorMessage,
  isFetching,
  staleThreshold,
}: DevicesTableProps) {
  const results = data?.results ?? [];

  return (
    <div
      className={cn("flex-1 rounded-md border bg-background overflow-hidden")}
    >
      <ScrollArea className="h-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[220px]">Cues</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead className="text-right">Last ping</TableHead>
              <TableHead className="text-right">Last data</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-10 text-center text-muted-foreground"
                >
                  Loading…
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-10 text-center text-muted-foreground"
                >
                  {errorMessage ?? "Something went wrong."}
                </TableCell>
              </TableRow>
            ) : results.length ? (
              results.map((d) => (
                <DeviceRow
                  key={d.id}
                  device={d}
                  staleThreshold={staleThreshold}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-muted-foreground"
                >
                  No devices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {isFetching ? (
        <div className="px-3 py-2 text-xs text-muted-foreground border-t">
          Updating…
        </div>
      ) : null}
    </div>
  );
}
