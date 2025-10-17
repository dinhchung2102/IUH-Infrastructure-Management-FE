import { useEffect, useState, useCallback, useRef } from "react";
import { getStaff } from "../api/staff.api";
import type { StaffResponse, QueryStaffDto } from "../types/staff.type";
import type {
  PaginationRequest,
  PaginationResponse,
} from "@/types/pagination.type";
import type { RoleName } from "@/types/role.enum";
import { DEFAULT_PAGINATION_RESPONSE } from "@/types/pagination.type";

interface UseStaffDataProps {
  filters: {
    search: string;
    isActive?: boolean;
    gender?: "MALE" | "FEMALE";
    role?: RoleName;
  };
  paginationRequest: PaginationRequest;
  onPaginationUpdate: (pagination: PaginationResponse) => void;
}

export function useStaffData({
  filters,
  paginationRequest,
  onPaginationUpdate,
}: UseStaffDataProps) {
  const [staff, setStaff] = useState<StaffResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sử dụng useRef để tránh stale closure
  const onPaginationUpdateRef = useRef(onPaginationUpdate);
  onPaginationUpdateRef.current = onPaginationUpdate;

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: QueryStaffDto = {
        ...paginationRequest,
        ...(filters.search && { search: filters.search }),
        ...(filters.isActive !== undefined && { isActive: filters.isActive }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.role && { role: filters.role }),
      };

      const res = await getStaff(query);
      setStaff(res?.data.accounts || []);
      onPaginationUpdateRef.current(
        res?.data?.pagination || DEFAULT_PAGINATION_RESPONSE
      );
    } catch (err) {
      setError(err as Error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, [filters, paginationRequest]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const updateStaffStatus = useCallback(
    (staffId: string, newStatus: boolean) => {
      setStaff((prevStaff) =>
        prevStaff.map((staff) =>
          staff._id === staffId ? { ...staff, isActive: newStatus } : staff
        )
      );
    },
    []
  );

  return {
    staff,
    loading,
    error,
    refetch: fetchStaff,
    updateStaffStatus,
  };
}
