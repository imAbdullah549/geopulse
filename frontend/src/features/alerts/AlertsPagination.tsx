import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AlertsPaginationProps = {
  total: number;
  showing: number;
  page: number;
  totalPages: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (n: number) => void;
  canPrev: boolean;
  canNext: boolean;
  className?: string;
};

export function AlertsPagination({
  total,
  showing,
  page,
  totalPages,
  pageSize,
  setPage,
  setPageSize,
  canPrev,
  canNext,
  className,
}: AlertsPaginationProps) {
  return (
    <div
      className={`shrink-0 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between ${
        className ?? ""
      }`}
    >
      <div>
        Total: {total} • Showing: {showing}
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
          onClick={() => setPage(Math.max(1, page - 1))}
          aria-label="Previous page"
        >
          Prev
        </Button>

        <div className="min-w-[120px] text-center">
          Page <span className="font-medium text-foreground">{page}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default memo(AlertsPagination);
