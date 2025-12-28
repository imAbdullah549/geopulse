import { useEffect, useState, useMemo } from "react";

export function usePagination(initialPage = 1, initialPageSize = 20) {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [total, setTotal] = useState<number>(0);

  // Reset to page 1 when pageSize changes
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  // Clamp page when totalPages decreases
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return {
    // state
    page,
    setPage,
    pageSize,
    setPageSize,

    // derived
    totalPages,
    canPrev,
    canNext,

    // method for caller to inform total count
    setTotal,
    total,
  } as const;
}
