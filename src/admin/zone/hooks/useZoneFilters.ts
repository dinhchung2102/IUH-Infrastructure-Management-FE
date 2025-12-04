import { useState, useCallback } from "react";

export interface ZoneFilters {
  search: string;
  status: string;
  campus: string;
  zoneType: string;
}

export function useZoneFilters() {
  const [filters, setFilters] = useState<ZoneFilters>({
    search: "",
    status: "all",
    campus: "all",
    zoneType: "all",
  });

  const updateFilters = useCallback((newFilters: Partial<ZoneFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      campus: "all",
      zoneType: "all",
    });
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.status !== "all" ||
      filters.campus !== "all" ||
      filters.zoneType !== "all"
  );

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}
