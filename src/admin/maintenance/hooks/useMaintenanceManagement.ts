import { useMaintenanceFilters } from "./useMaintenanceFilters";
import { useMaintenancePagination } from "./useMaintenancePagination";
import { useMaintenanceData } from "./useMaintenanceData";

/**
 * Custom hook tổng hợp để quản lý tất cả logic của Maintenance Management
 */
export function useMaintenanceManagement() {
  // Filters management
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useMaintenanceFilters();

  // Pagination management
  const {
    paginationRequest,
    pagination,
    updatePagination,
    changePage,
    changeSort,
    resetToFirstPage,
  } = useMaintenancePagination();

  // Data fetching
  const { maintenances, loading, error, refetch } = useMaintenanceData({
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
    maintenances,
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
  };
}
