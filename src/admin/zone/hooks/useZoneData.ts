import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  getZones,
  deleteZone,
  type ZoneResponse,
  type QueryZoneDto,
} from "../api/zone.api";
import type { ZoneFilters } from "./useZoneFilters";
import type {
  PaginationRequest,
  PaginationResponse,
} from "@/types/pagination.type";
import { DEFAULT_PAGINATION_RESPONSE } from "@/types/pagination.type";

interface UseZoneDataProps {
  filters: ZoneFilters;
  paginationRequest: PaginationRequest;
  onPaginationUpdate: (pagination: PaginationResponse) => void;
}

export function useZoneData({
  filters,
  paginationRequest,
  onPaginationUpdate,
}: UseZoneDataProps) {
  const [zones, setZones] = useState<ZoneResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Sử dụng useRef để tránh stale closure
  const onPaginationUpdateRef = useRef(onPaginationUpdate);
  onPaginationUpdateRef.current = onPaginationUpdate;

  const fetchZones = useCallback(async () => {
    try {
      setLoading(true);
      const query: QueryZoneDto = {
        ...paginationRequest,
      };

      if (filters.search) {
        query.search = filters.search;
      }

      if (filters.status !== "all") {
        query.status = filters.status as
          | "ACTIVE"
          | "INACTIVE"
          | "UNDERMAINTENANCE";
      }

      if (filters.campus !== "all") {
        query.campus = filters.campus;
      }

      if (filters.zoneType !== "all") {
        query.zoneType = filters.zoneType as
          | "FUNCTIONAL"
          | "TECHNICAL"
          | "SERVICE"
          | "PUBLIC";
      }

      const res = await getZones(query);
      setZones(res?.data?.zones || []);
      onPaginationUpdateRef.current(
        res?.data?.pagination || DEFAULT_PAGINATION_RESPONSE
      );
    } catch (err) {
      console.error("Lỗi khi tải khu vực:", err);
      toast.error("Không thể tải danh sách khu vực");
      setZones([]);
      onPaginationUpdateRef.current(DEFAULT_PAGINATION_RESPONSE);
    } finally {
      setLoading(false);
    }
  }, [filters, paginationRequest]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!id) {
        toast.error("Không tìm thấy ID khu vực.");
        return;
      }
      if (!confirm("Bạn có chắc muốn xóa khu vực này?")) return;

      try {
        await deleteZone(id);
        toast.success("Đã xóa khu vực thành công!");
        await fetchZones();
      } catch (err: unknown) {
        console.error("Lỗi khi xóa khu vực:", err);
        const error = err as { response?: { status?: number } };
        if (error?.response?.status === 404)
          toast.error("Khu vực không tồn tại hoặc đã bị xóa trước đó.");
        else if (error?.response?.status === 409)
          toast.error("Không thể xóa khu vực này (đang được sử dụng).");
        else toast.error("Có lỗi xảy ra khi xóa khu vực.");
      }
    },
    [fetchZones]
  );

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return {
    zones,
    loading,
    refetch: fetchZones,
    handleDelete,
  };
}
