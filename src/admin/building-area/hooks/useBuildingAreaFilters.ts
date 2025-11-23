import { useState, useCallback } from "react";

export type FilterType = "BUILDING" | "AREA";

export interface BuildingAreaFilters {
  search: string;
  status: string;
  campus: string;
  zoneType?: string; // Only for AREA
}

export function useBuildingAreaFilters(
  defaultCampusId?: string
) {
  const [filters, setFilters] = useState<BuildingAreaFilters>({
    search: "",
    status: "",
    campus: defaultCampusId || "",
    zoneType: "",
  });

  const handleFiltersChange = useCallback(
    (updates: Partial<BuildingAreaFilters>) => {
      setFilters((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "",
      campus: defaultCampusId || "",
      zoneType: "",
    });
  }, [defaultCampusId]);

  return {
    filters,
    handleFiltersChange,
    handleClearFilters,
  };
}

