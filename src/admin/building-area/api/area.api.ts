import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export const CommonStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  UNDERMAINTENANCE: "UNDERMAINTENANCE",
} as const;

export type CommonStatus = (typeof CommonStatus)[keyof typeof CommonStatus];

export const ZoneType = {
  SERVICE: "SERVICE",
  LEARNING: "LEARNING",
  PARKING: "PARKING",
  OTHER: "OTHER",
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
  keyword?: string;
  page?: number;
  limit?: number;
  campus?: string;
  zoneType?: ZoneType;
}

/* ============================
 *  API CALLS
 * ============================ */

/** Lấy danh sách khu vực */
export const getAreas = async (query?: QueryAreaDto) => {
  const res = await api.get<ApiResponse<{ areas: AreaResponse[] }>>(
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
