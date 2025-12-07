import { useState, useCallback } from "react";
import type { PaginationResponse } from "@/types/pagination.type";

const DEFAULT_PAGINATION_REQUEST = {
  page: 1,
  limit: 10,
  sortBy: "scheduledDate",
  sortOrder: "asc" as "asc" | "desc",
};

const DEFAULT_PAGINATION_RESPONSE: PaginationResponse = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
};

export function useMaintenancePagination() {
  const [paginationRequest, setPaginationRequest] = useState(
    DEFAULT_PAGINATION_REQUEST
  );
  const [pagination, setPagination] = useState<PaginationResponse>(
    DEFAULT_PAGINATION_RESPONSE
  );

  const updatePagination = useCallback((newPagination: PaginationResponse) => {
    setPagination(newPagination);
  }, []);

  const changePage = useCallback((page: number) => {
    setPaginationRequest((prev) => ({ ...prev, page }));
  }, []);

  const changeSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      setPaginationRequest((prev) => ({
        ...prev,
        sortBy,
        sortOrder,
        page: 1, // Reset to first page when sorting
      }));
    },
    []
  );

  const resetToFirstPage = useCallback(() => {
    setPaginationRequest((prev) => ({ ...prev, page: 1 }));
  }, []);

  return {
    paginationRequest,
    pagination,
    updatePagination,
    changePage,
    changeSort,
    resetToFirstPage,
  };
}
