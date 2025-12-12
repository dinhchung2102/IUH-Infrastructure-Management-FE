import { useAssetFilters } from "./useAssetFilters";
import { useAssetPagination } from "./useAssetPagination";
import { useAssetData } from "./useAssetData";

/**
 * Custom hook tổng hợp để quản lý tất cả logic của Asset Management
 *
 * @example
 * const {
 *   assets,
 *   loading,
 *   filters,
 *   pagination,
 *   handleFiltersChange,
 *   handlePageChange,
 * } = useAssetManagement();
 */
export function useAssetManagement() {
  // Filters management
  const { filters, handleFiltersChange, handleClearFilters } =
    useAssetFilters();

  // Pagination management
  const {
    paginationRequest,
    pagination,
    updatePagination,
    changePage,
    resetToFirstPage,
  } = useAssetPagination();

  // Data fetching
  const { assets, loading, stats, handleDelete, refetchAll, refetch } =
    useAssetData({
      filters,
      paginationRequest,
      onPaginationUpdate: updatePagination,
    });

  // Handler để thay đổi filters và reset về trang 1
  const handleFiltersChangeWithReset = (
    partial: Parameters<typeof handleFiltersChange>[0]
  ) => {
    handleFiltersChange(partial);
    resetToFirstPage();
  };

  return {
    // Data
    assets,
    loading,
    stats,

    // Filters
    filters,
    handleFiltersChange: handleFiltersChangeWithReset,
    handleClearFilters: () => {
      handleClearFilters();
      resetToFirstPage();
    },

    // Pagination
    pagination,
    paginationRequest,
    handlePageChange: changePage,

    // Utils
    refetch,
    refetchAll,
    handleDelete,
  };
}

