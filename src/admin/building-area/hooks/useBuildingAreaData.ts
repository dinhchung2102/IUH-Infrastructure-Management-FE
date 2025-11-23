import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  getBuildings,
  deleteBuilding,
  type BuildingResponse,
} from "../api/building.api";
import {
  getAreas,
  deleteArea,
  type AreaResponse,
  type ZoneType,
} from "../api/area.api";
import { getCampus, type CampusResponse } from "../../campus/api/campus.api";
import type { FilterType } from "./useBuildingAreaFilters";
import type { QueryBuildingDto } from "../api/building.api";
import type { QueryAreaDto } from "../api/area.api";
import type {
  PaginationRequest,
  PaginationResponse,
} from "@/types/pagination.type";

export type BuildingAreaItem =
  | (BuildingResponse & { type: "BUILDING" })
  | (AreaResponse & { type: "AREA" });

interface UseBuildingAreaDataProps {
  filterType: FilterType;
  filters: {
    search: string;
    status: string;
    campus: string;
    zoneType?: string;
  };
  paginationRequest: PaginationRequest;
}

export function useBuildingAreaData({
  filterType,
  filters,
  paginationRequest,
}: UseBuildingAreaDataProps) {
  const [items, setItems] = useState<BuildingAreaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<CampusResponse[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse | null>(null);

  // Fetch campuses
  const fetchCampuses = useCallback(async () => {
    try {
      const res = await getCampus();
      const list = res?.data?.campuses || [];
      setCampuses(list);
      return list;
    } catch (err) {
      console.error("Lỗi tải cơ sở:", err);
      return [];
    }
  }, []);

  // Fetch data based on filterType
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      if (filterType === "BUILDING") {
        const query: QueryBuildingDto = {
          search: filters.search || undefined,
          status: filters.status || undefined,
          campus: filters.campus || undefined,
          page: paginationRequest.page,
          limit: paginationRequest.limit,
          sortBy: paginationRequest.sortBy,
          sortOrder: paginationRequest.sortOrder,
        };

        const res = await getBuildings(query);

        if (res?.success && res.data) {
          const buildings = res.data.buildings.map((b) => ({
            ...b,
            type: "BUILDING" as const,
          }));
          setItems(buildings);
          setPagination(res.data.pagination);
          return res.data.pagination;
        } else {
          toast.error(res?.message || "Không thể tải danh sách tòa nhà");
          setItems([]);
          setPagination(null);
          return null;
        }
      } else {
        // AREA
        const query: QueryAreaDto = {
          search: filters.search || undefined,
          status: filters.status || undefined,
          campus: filters.campus || undefined,
          zoneType: filters.zoneType
            ? (filters.zoneType as ZoneType)
            : undefined,
          page: paginationRequest.page,
          limit: paginationRequest.limit,
          sortBy: paginationRequest.sortBy,
          sortOrder: paginationRequest.sortOrder,
        };

        const res = await getAreas(query);

        if (res?.success && res.data) {
          const areas = res.data.areas.map((a) => ({
            ...a,
            type: "AREA" as const,
          }));
          setItems(areas);
          setPagination(res.data.pagination);
          return res.data.pagination;
        } else {
          toast.error(res?.message || "Không thể tải danh sách khu vực");
          setItems([]);
          setPagination(null);
          return null;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(
        `Không thể tải danh sách ${
          filterType === "BUILDING" ? "tòa nhà" : "khu vực"
        }`
      );
      setItems([]);
      setPagination(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [filterType, filters, paginationRequest]);

  // Delete item
  const handleDelete = useCallback(
    async (item: BuildingAreaItem) => {
      try {
        const confirm = window.confirm(
          `Bạn có chắc chắn muốn xóa ${
            item.type === "BUILDING" ? "tòa nhà" : "khu vực ngoài trời"
          } "${item.name}" không?`
        );
        if (!confirm) return;

        if (item.type === "BUILDING") {
          const res = await deleteBuilding(item._id);
          if (res?.success) {
            toast.success("Đã xóa tòa nhà thành công");
            await fetchData();
          } else {
            toast.error(res?.message || "Xóa tòa nhà thất bại");
          }
        } else {
          const res = await deleteArea(item._id);
          if (res?.success) {
            toast.success("Đã xóa khu vực ngoài trời thành công");
            await fetchData();
          } else {
            toast.error(res?.message || "Xóa khu vực ngoài trời thất bại");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error("Xóa thất bại, vui lòng thử lại");
      }
    },
    [fetchData]
  );

  // Initial fetch campuses
  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  // Only fetch data when campus filter is set (to avoid double call)
  // Wait for campuses to be loaded first
  useEffect(() => {
    if (campuses.length > 0 && filters.campus) {
      fetchData();
    }
  }, [fetchData, filters.campus, campuses.length]);

  return {
    items,
    loading,
    campuses,
    pagination,
    fetchData,
    handleDelete,
  };
}
