import { useState, useCallback } from "react";
import type { QueryStaffDto } from "../types/staff.type";
import type { RoleName } from "@/types/role.enum";

interface StaffFilters {
  search: string;
  isActive?: boolean;
  gender?: "MALE" | "FEMALE";
  role?: RoleName;
}

export function useStaffFilters() {
  const [filters, setFilters] = useState<StaffFilters>({
    search: "",
  });

  const updateFilters = useCallback((newFilters: Partial<QueryStaffDto>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      search: "",
      isActive: undefined,
      gender: undefined,
      role: undefined,
    });
  }, []);

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.isActive !== undefined ||
      filters.gender ||
      filters.role
  );

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}
