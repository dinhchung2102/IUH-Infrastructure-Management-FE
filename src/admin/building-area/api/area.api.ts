import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export const CommonStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  UNDERMAINTENANCE: "UNDERMAINTENANCE",
} as const;

export type CommonStatus = (typeof CommonStatus)[keyof typeof CommonStatus];

export const ZoneType = {
  FUNCTIONAL: "FUNCTIONAL",
  TECHNICAL: "TECHNICAL",
  SERVICE: "SERVICE",
  PUBLIC: "PUBLIC",
} as const;

export type ZoneType = (typeof ZoneType)[keyof typeof ZoneType];

export interface AreaResponse {
  _id: string;
  name: string;
  status: CommonStatus;
  description?: string;
  zoneType: ZoneType;
  campus: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAreaDto {
  name: string;
  status: CommonStatus;
  description?: string;
  campus: string; // ID của campus
  zoneType: ZoneType;
}

export interface UpdateAreaDto extends Partial<CreateAreaDto> {}

export interface QueryAreaDto {
  search?: string;
  status?: string;
  campus?: string;
  zoneType?: ZoneType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/* ============================
 *  API CALLS
 * ============================ */

/** Response từ API với pagination */
export interface AreasListResponse {
  areas: AreaResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/** Lấy danh sách khu vực */
export const getAreas = async (
  query?: QueryAreaDto
): Promise<ApiResponse<AreasListResponse>> => {
  const res = await api.get<ApiResponse<AreasListResponse>>(
    "/zone-area/areas",
    {
      params: query,
    }
  );
  return res.data;
};

/** Lấy chi tiết khu vực theo ID */
export const getAreaById = async (id: string) => {
  const res = await api.get<ApiResponse<AreaResponse>>(
    `/zone-area/areas/${id}`
  );
  return res.data;
};

/** Tạo khu vực mới */
export const createArea = async (data: CreateAreaDto) => {
  const res = await api.post<ApiResponse<AreaResponse>>(
    "/zone-area/areas",
    data
  );
  return res.data;
};

/** Cập nhật khu vực */
export const updateArea = async (id: string, data: UpdateAreaDto) => {
  const res = await api.patch<ApiResponse<AreaResponse>>(
    `/zone-area/areas/${id}`,
    data
  );
  return res.data;
};

/** Xóa khu vực */
export const deleteArea = async (id: string) => {
  const res = await api.delete<ApiResponse<void>>(`/zone-area/areas/${id}`);
  return res.data;
};

/** ✅ Lấy danh sách khu vực theo campus */
export const getAreasByCampus = async (campusId: string) => {
  const res = await api.get<ApiResponse<AreaResponse[]>>(
    `/zone-area/areas/by-campus/${campusId}`
  );
  return res.data;
};

export interface AreaStatsData {
  total: number;
  active: number;
  inactive: number;
  underMaintenance: number;
}

export interface AreaStatsResponse {
  total: number;
  active: number;
  inactive: number;
  underMaintenance: number;
}

export const getAreaStats = async (): Promise<AreaStatsResponse> => {
  const res = await api.get<ApiResponse<{ data: AreaStatsData }>>(
    "/zone-area/areas-stats"
  );
  const data = res.data.data?.data || res.data.data;
  if (data && "total" in data) {
    return data as AreaStatsResponse;
  }
  return { total: 0, active: 0, inactive: 0, underMaintenance: 0 };
};

/** ============================
 *  Thống kê khu vực theo Campus (Tất cả campus)
 *  Endpoint: /zone-area/areas-stats-by-campus
 * ============================ */

export interface AreaStatsByCampusItem {
  campusId: string;
  campusName: string;
  total: number;
  active: number;
  inactive: number;
  underMaintenance: number;
}

export type AreaStatsByCampusResponse = AreaStatsByCampusItem[];

export const getAreaStatsByCampus = async (): Promise<AreaStatsByCampusResponse> => {
  const res = await api.get<ApiResponse<{ data: AreaStatsByCampusItem[] }>>(
    "/zone-area/areas-stats-by-campus"
  );
  const data = res.data.data?.data || res.data.data;
  if (Array.isArray(data)) {
    return data;
  }
  return [];
};