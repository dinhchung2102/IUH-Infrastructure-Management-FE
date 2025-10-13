import { useEffect, useState, useCallback, useRef } from "react";
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

  // Sử dụng useRef để tránh stale closure
  const onPaginationUpdateRef = useRef(onPaginationUpdate);
  onPaginationUpdateRef.current = onPaginationUpdate;

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
      onPaginationUpdateRef.current(
        res?.data?.pagination || DEFAULT_PAGINATION_RESPONSE
      );
    } catch (err) {
      setError(err as Error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, paginationRequest]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const updateAccountStatus = useCallback(
    (accountId: string, newStatus: boolean) => {
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account._id === accountId
            ? { ...account, isActive: newStatus }
            : account
        )
      );
    },
    []
  );

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
    updateAccountStatus,
  };
}
