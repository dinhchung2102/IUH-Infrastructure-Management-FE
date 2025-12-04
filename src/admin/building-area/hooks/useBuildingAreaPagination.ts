import { useState, useCallback } from "react";
import type {
  PaginationRequest,
  PaginationResponse,
} from "@/types/pagination.type";
import {
  DEFAULT_PAGINATION_REQUEST,
  DEFAULT_PAGINATION_RESPONSE,
} from "@/types/pagination.type";

export function useBuildingAreaPagination() {
  const [paginationRequest, setPaginationRequest] = useState<PaginationRequest>(
    {
      ...DEFAULT_PAGINATION_REQUEST,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  );
  const [pagination, setPagination] = useState<PaginationResponse>(
    DEFAULT_PAGINATION_RESPONSE
  );

  const updatePagination = useCallback((newPagination: PaginationResponse) => {
    setPagination(newPagination);
  }, []);

  const changePage = useCallback((page: number) => {
    setPaginationRequest((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const changeSort = useCallback(
    (sortBy: string, sortOrder: "asc" | "desc") => {
      setPaginationRequest((prev) => ({
        ...prev,
        sortBy,
        sortOrder,
        page: 1, // Reset về trang 1 khi sort
      }));
    },
    []
  );

  const resetToFirstPage = useCallback(() => {
    setPaginationRequest((prev) => ({
      ...prev,
      page: 1,
    }));
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

