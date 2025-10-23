import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

// ============================
// INTERFACES
// ============================

export interface ZoneResponse {
  id: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  building: string;
  zoneType: "ROOM" | "AREA" | "OTHER";
  floorLocation?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QueryZoneDto {
  keyword?: string;
  page?: number;
  limit?: number;
}

// ============================
// API CALLS
// ============================

// Lấy tất cả zones
export const getZones = async (query?: QueryZoneDto) => {
  const res = await api.get<ApiResponse<{ zones: ZoneResponse[] }>>(
    "/zone-area/zones",
    {
      params: query,
    }
  );
  return res.data;
};

// Lấy zone theo id
export const getZoneById = async (id: string) => {
  const res = await api.get<ApiResponse<ZoneResponse>>(
    `/zone-area/zones/${id}`
  );
  return res.data;
};

// Tạo zone mới
export const createZone = async (data: Partial<ZoneResponse>) => {
  const res = await api.post<ApiResponse<ZoneResponse>>(
    "/zone-area/zones",
    data
  );
  return res.data;
};

// Cập nhật zone
export const updateZone = async (id: string, data: Partial<ZoneResponse>) => {
  const res = await api.patch<ApiResponse<ZoneResponse>>(
    `/zone-area/zones/${id}`,
    data
  );
  return res.data;
};

// Xóa zone
export const deleteZone = async (id: string) => {
  const res = await api.delete<ApiResponse<void>>(`/zone-area/zones/${id}`);
  return res.data;
};
// 🟢 Lấy thống kê khu vực (dành cho ZoneStatsCards & ZoneStatsDialog)
export const getZoneStats = async () => {
  return api.get("/zones/stats");
};
// Lấy tất cả zones theo buildingId
export const getZonesByBuildingId = async (buildingId: string) => {
  const res = await api.get<ApiResponse<{ zones: ZoneResponse[] }>>(
    `/zone-area/buildings/${buildingId}/zones`
  );
  return res.data;
};

// Lấy tất cả zones theo buildingId và floor
export const getZonesByBuildingFloor = async (
  buildingId: string,
  floor: number
) => {
  const res = await api.get<ApiResponse<{ zones: ZoneResponse[] }>>(
    `/zone-area/buildings/${buildingId}/zones/floor/${floor}`
  );
  return res.data;
};
