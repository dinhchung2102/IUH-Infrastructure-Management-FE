import { useEffect, useState, useCallback } from "react";
import { getAccounts } from "../api/account.api";
import type { AccountResponse, QueryAccountsDto } from "../types/account.type";
import type {
  PaginationRequest,
  PaginationResponse,
} from "@/types/pagination.type";
import type { RoleName } from "@/types/role.enum";
import { DEFAULT_PAGINATION_RESPONSE } from "@/types/pagination.type";

interface UseAccountDataProps {
  filters: {
    search: string;
    isActive?: boolean;
    gender?: "MALE" | "FEMALE";
    role?: RoleName;
  };
  paginationRequest: PaginationRequest;
  onPaginationUpdate: (pagination: PaginationResponse) => void;
}

export function useAccountData({
  filters,
  paginationRequest,
  onPaginationUpdate,
}: UseAccountDataProps) {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: QueryAccountsDto = {
        ...paginationRequest,
        ...(filters.search && { search: filters.search }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.role && { role: filters.role }),
      };

      const res = await getAccounts(query);
      setAccounts(res?.data.accounts || []);
      onPaginationUpdate(res?.data?.pagination || DEFAULT_PAGINATION_RESPONSE);
    } catch (err) {
      setError(err as Error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, paginationRequest, onPaginationUpdate]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
  };
}
