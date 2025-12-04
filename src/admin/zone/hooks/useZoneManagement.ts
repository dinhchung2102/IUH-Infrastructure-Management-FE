import { useZoneFilters } from "./useZoneFilters";
import { useZonePagination } from "./useZonePagination";
import { useZoneData } from "./useZoneData";
import { useZoneStats } from "./useZoneStats";
import { useZoneCampuses } from "./useZoneCampuses";

/**
 * Custom hook tổng hợp để quản lý tất cả logic của Zone Management
 *
 * @example
 * const {
 *   zones,
 *   loading,
 *   stats,
 *   campuses,
 *   filters,
 *   pagination,
 *   paginationRequest,
 *   handleFiltersChange,
 *   handlePageChange,
 *   handleDelete,
 *   refetch,
 * } = useZoneManagement();
 */
export function useZoneManagement() {
  // Filters management
  const { filters, updateFilters, clearFilters, hasActiveFilters } =
    useZoneFilters();

  // Pagination management
  const {
    paginationRequest,
    pagination,
    updatePagination,
    changePage,
    changeSort,
    resetToFirstPage,
  } = useZonePagination();

  // Data fetching
  const { zones, loading, refetch, handleDelete } = useZoneData({
    filters,
    paginationRequest,
    onPaginationUpdate: updatePagination,
  });

  // Stats fetching
  const { stats, refetch: refetchStats } = useZoneStats();

  // Campuses fetching
  const { campuses } = useZoneCampuses();

  // Handler để thay đổi filters và reset về trang 1
  const handleFiltersChange = (
    newFilters: Parameters<typeof updateFilters>[0]
  ) => {
    updateFilters(newFilters);
    resetToFirstPage();
  };

  // Handler để refetch cả zones và stats
  const handleRefetch = () => {
    refetch();
    refetchStats();
  };

  return {
    // Data
    zones,
    loading,
    stats,
    campuses,

    // Filters
    filters,
    hasActiveFilters,
    handleFiltersChange,
    clearFilters,

    // Pagination
    pagination,
    paginationRequest,
    handlePageChange: changePage,
    handleSortChange: changeSort,

    // Actions
    handleDelete,
    refetch: handleRefetch,
  };
}
