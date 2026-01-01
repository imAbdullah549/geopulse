import { useMemo, useState } from "react";

type UsePaginationOptions = {
  initialPage?: number;
  initialPageSize?: number;
  total: number;
};

export function usePagination({
  total,
  initialPage = 1,
  initialPageSize = 20,
}: UsePaginationOptions) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // safety: if total shrinks and current page becomes invalid, clamp
  const safePage = Math.min(page, totalPages);

  // expose safePage as `page` so UI never shows invalid page
  // and allow setting page normally
  return {
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    canPrev,
    canNext,
  };
}
