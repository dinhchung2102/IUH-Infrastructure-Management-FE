import { useAccountFilters } from "./useAccountFilters";
import { useAccountPagination } from "./useAccountPagination";
import { useAccountData } from "./useAccountData";

/**
 * Custom hook tổng hợp để quản lý tất cả logic của Account Management
 *
 * @example
 * const {
 *   accounts,
 *   loading,
 *   filters,
 *   pagination,
 *   handleFiltersChange,
 *   handleSortChange,
 *   handlePageChange,
 * } = useAccountManagement();
 */
export function useAccountManagement() {
  // Filters management
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useAccountFilters();

  // Pagination management
  const {
    paginationRequest,
    pagination,
    updatePagination,
    changePage,
    changeSort,
    resetToFirstPage,
  } = useAccountPagination();

  // Data fetching
  const { accounts, loading, error, refetch, updateAccountStatus } =
    useAccountData({
      filters,
      paginationRequest,
      onPaginationUpdate: updatePagination,
    });

  // Handler để thay đổi filters và reset về trang 1
  const handleFiltersChange = (
    newFilters: Parameters<typeof updateFilters>[0]
  ) => {
    updateFilters(newFilters);
    resetToFirstPage();
  };

  return {
    // Data
    accounts,
    loading,
    error,

    // Filters
    filters,
    hasActiveFilters,
    handleFiltersChange,
    clearFilters,

    // Pagination
    pagination,
    paginationRequest,
    handlePageChange: changePage,

    // Sort
    handleSortChange: changeSort,

    // Utils
    refetch,
    updateAccountStatus,
  };
}
