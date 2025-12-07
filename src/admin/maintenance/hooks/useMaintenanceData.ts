import { useState, useEffect, useCallback, useRef } from "react";
import { getMaintenances } from "../api/maintenance.api";
import type {
  Maintenance,
  QueryMaintenanceDto,
  MaintenanceListResponse,
  MaintenanceStatus,
  MaintenancePriority,
} from "../types/maintenance.type";
import type { PaginationResponse } from "@/types/pagination.type";
import { toast } from "sonner";

const DEFAULT_PAGINATION_RESPONSE: PaginationResponse = {
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
};

// Helper function to handle nested data structure
function extractData<T>(responseData: T | { data: T }): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as { data: T }).data;
  }
  return responseData;
}

interface UseMaintenanceDataProps {
  filters: {
    search?: string;
    status?: string;
    priority?: string;
    asset?: string;
    assignedTo?: string;
    startDate?: string;
    endDate?: string;
  };
  paginationRequest: {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
  onPaginationUpdate: (pagination: PaginationResponse) => void;
}

export function useMaintenanceData({
  filters,
  paginationRequest,
  onPaginationUpdate,
}: UseMaintenanceDataProps) {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sử dụng useRef để tránh stale closure
  const onPaginationUpdateRef = useRef(onPaginationUpdate);
  onPaginationUpdateRef.current = onPaginationUpdate;

  const fetchMaintenances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const query: QueryMaintenanceDto = {
        ...paginationRequest,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && {
          status: filters.status as MaintenanceStatus,
        }),
        ...(filters.priority && {
          priority: filters.priority as MaintenancePriority,
        }),
        ...(filters.asset && { asset: filters.asset }),
        ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };

      const res = await getMaintenances(query);
      if (res.success && res.data) {
        // Extract nested data if needed
        const data = extractData<MaintenanceListResponse>(res.data);
        setMaintenances(data.maintenances || []);
        onPaginationUpdateRef.current(
          data.pagination || DEFAULT_PAGINATION_RESPONSE
        );
      } else {
        toast.error(res.message || "Không thể tải danh sách lịch bảo trì");
        setMaintenances([]);
      }
    } catch (err) {
      console.error("Error fetching maintenances:", err);
      setError(err as Error);
      setMaintenances([]);
      toast.error("Lỗi khi tải danh sách lịch bảo trì");
    } finally {
      setLoading(false);
    }
  }, [filters, paginationRequest]);

  useEffect(() => {
    fetchMaintenances();
  }, [fetchMaintenances]);

  return {
    maintenances,
    loading,
    error,
    refetch: fetchMaintenances,
  };
}
