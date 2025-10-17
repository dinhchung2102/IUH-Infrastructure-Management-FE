import { useStaffFilters } from "./useStaffFilters";
import { useStaffPagination } from "./useStaffPagination";
import { useStaffData } from "./useStaffData";

/**
 * Custom hook tổng hợp để quản lý tất cả logic của Staff Management
 *
 * @example
 * const {
 *   staff,
 *   loading,
 *   filters,
 *   pagination,
 *   handleFiltersChange,
 *   handleSortChange,
 *   handlePageChange,
 * } = useStaffManagement();
 */
export function useStaffManagement() {
  // Filters management
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useStaffFilters();

  // Pagination management
  const {
    paginationRequest,
    pagination,
    updatePagination,
    changePage,
    changeSort,
    resetToFirstPage,
  } = useStaffPagination();

  // Data fetching
  const { staff, loading, error, refetch, updateStaffStatus } = useStaffData({
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
    staff,
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
    updateStaffStatus,
  };
}
