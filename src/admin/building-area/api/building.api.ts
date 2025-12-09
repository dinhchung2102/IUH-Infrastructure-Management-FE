import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

/* ============================
 *  ENUM & TYPES
 * ============================ */

/** Trạng thái của tòa nhà */
export const CommonStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  UNDERMAINTENANCE: "UNDERMAINTENANCE",
} as const;

export type CommonStatus = (typeof CommonStatus)[keyof typeof CommonStatus];

/** Dữ liệu trả về từ API */
export interface BuildingResponse {
  _id: string;
  name: string;
  floor: number;
  status: CommonStatus;
  campus: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

/** DTO khi tạo mới tòa nhà */
export interface CreateBuildingDto {
  name: string;
  floor: number;
  status: CommonStatus;
  campus: string; // ID của Campus
}

/** DTO khi cập nhật */
export interface UpdateBuildingDto {
  name?: string;
  floor?: number;
  status?: CommonStatus;
  campus?: string;
}

/** Tham số truy vấn khi lấy danh sách */
export interface QueryBuildingDto {
  search?: string;
  status?: string;
  campus?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/* ============================
 *  API CALLS
 * ============================ */

/** Response từ API với pagination */
export interface BuildingsListResponse {
  buildings: BuildingResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/** Lấy danh sách tòa nhà */
export const getBuildings = async (
  query?: QueryBuildingDto
): Promise<ApiResponse<BuildingsListResponse>> => {
  const res = await api.get<ApiResponse<BuildingsListResponse>>(
    "/zone-area/buildings",
    { params: query }
  );
  return res.data;
};

/** Lấy chi tiết tòa nhà theo ID */
export const getBuildingById = async (id: string) => {
  const res = await api.get<ApiResponse<{ building: BuildingResponse }>>(
    `/zone-area/buildings/${id}`
  );
  return res.data;
};

/** Tạo mới tòa nhà */
export const createBuilding = async (data: CreateBuildingDto) => {
  const res = await api.post<ApiResponse<{ building: BuildingResponse }>>(
    "/zone-area/buildings",
    data
  );
  return res.data;
};

/** Cập nhật tòa nhà */
export const updateBuilding = async (id: string, data: UpdateBuildingDto) => {
  const res = await api.patch<ApiResponse<{ building: BuildingResponse }>>(
    `/zone-area/buildings/${id}`,
    data
  );
  return res.data;
};

/** Xóa tòa nhà */
export const deleteBuilding = async (id: string) => {
  const res = await api.delete<ApiResponse<void>>(`/zone-area/buildings/${id}`);
  return res.data;
};

/** Lấy danh sách tòa nhà theo Campus */
export const getBuildingsByCampus = async (campusId: string) => {
  const res = await api.get<ApiResponse<{ buildings: BuildingResponse[] }>>(
    `/zone-area/buildings/campus/${campusId}`
  );
  return res.data;
};
/** ============================
 *  Thống kê tòa nhà (Buildings)
 *  Endpoint: /zone-area/buildings-stats
 * ============================ */

export interface BuildingStatsData {
  total: number;
  active: number;
  inactive: number;
  underMaintenance: number;
}

export interface BuildingStatsResponse {
  total: number;
  active: number;
  inactive: number;
  underMaintenance: number;
}

export const getBuildingStats = async (): Promise<BuildingStatsResponse> => {
  const res = await api.get<ApiResponse<{ data: BuildingStatsData }>>(
    "/zone-area/buildings-stats"
  );
  const data = res.data.data?.data || res.data.data;
  if (data && "total" in data) {
    return data as BuildingStatsResponse;
  }
  return { total: 0, active: 0, inactive: 0, underMaintenance: 0 };
};

/** ============================
 *  Thống kê tòa nhà theo Campus (Tất cả campus)
 *  Endpoint: /zone-area/buildings-stats-by-campus
 * ============================ */

export interface BuildingStatsByCampusItem {
  campusId: string;
  campusName: string;
  total: number;
  active: number;
  inactive: number;
  underMaintenance: number;
}

export type BuildingStatsByCampusResponse = BuildingStatsByCampusItem[];

export const getBuildingStatsByCampus =
  async (): Promise<BuildingStatsByCampusResponse> => {
    const res = await api.get<
      ApiResponse<{ data: BuildingStatsByCampusItem[] }>
    >("/zone-area/buildings-stats-by-campus");
    const data = res.data.data?.data || res.data.data;
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  };
