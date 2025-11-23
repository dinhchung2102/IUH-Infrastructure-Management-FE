import { useState } from "react";

interface AssetFilters {
  search: string;
  statusFilter: string;
  typeFilter: string;
}

/**
 * Hook quản lý state bộ lọc cho trang Asset
 */
export function useAssetFilters() {
  const [filters, setFilters] = useState<AssetFilters>({
    search: "",
    statusFilter: "all",
    typeFilter: "all",
  });

  const handleFiltersChange = (partial: Partial<AssetFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      statusFilter: "all",
      typeFilter: "all",
    });
  };

  return {
    filters,
    handleFiltersChange,
    handleClearFilters,
  };
}
