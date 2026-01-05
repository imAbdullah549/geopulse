type UsePaginationOptions = {
  total: number;
  page: number;
  pageSize: number;
};

export function usePagination({ total, page, pageSize }: UsePaginationOptions) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  return {
    page: safePage,
    totalPages,
    canPrev: safePage > 1,
    canNext: safePage < totalPages,
  };
}
