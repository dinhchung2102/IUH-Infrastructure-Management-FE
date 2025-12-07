import { useState, useCallback } from "react";

interface MaintenanceFilters {
  search?: string;
  status?: string;
  priority?: string;
  asset?: string;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
}

export function useMaintenanceFilters() {
  const [filters, setFilters] = useState<MaintenanceFilters>({});

  const updateFilters = useCallback(
    (newFilters: Partial<MaintenanceFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some(
      (value) => value !== undefined && value !== ""
    );
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters: hasActiveFilters(),
  };
}
