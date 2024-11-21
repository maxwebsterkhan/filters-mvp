// hooks/usePagination.ts
export function usePagination(
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) {
  return { currentPage, totalPages, onPageChange };
}
