import { useState } from "react";

interface CampusManagementFilters {
  search: string;
  statusFilter: string;
  managerFilter: string;
}

/**
 * Custom hook to manage filters state for Campus page
 */
export function useCampusFilters() {
  const [filters, setFilters] = useState<CampusManagementFilters>({
    search: "",
    statusFilter: "all",
    managerFilter: "all",
  });

  const handleFiltersChange = (partial: Partial<CampusManagementFilters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      statusFilter: "all",
      managerFilter: "all",
    });
  };

  return {
    filters,
    handleFiltersChange,
    handleClearFilters,
  };
}
