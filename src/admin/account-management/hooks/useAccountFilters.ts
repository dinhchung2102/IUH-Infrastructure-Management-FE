import { useState, useCallback } from "react";
import type { QueryAccountsDto } from "../types/account.type";
import type { RoleName } from "@/types/role.enum";

interface AccountFilters {
  search: string;
  isActive?: boolean;
  gender?: "MALE" | "FEMALE";
  role?: RoleName;
}

export function useAccountFilters() {
  const [filters, setFilters] = useState<AccountFilters>({
    search: "",
  });

  const updateFilters = useCallback((newFilters: Partial<QueryAccountsDto>) => {
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
