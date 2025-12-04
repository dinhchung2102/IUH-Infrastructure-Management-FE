import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

// ============================
// INTERFACES
// ============================

export interface ZoneResponse {
  _id: string;
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  building:
    | string
    | {
        _id: string;
        name?: string;
        floor?: number;
        campus?: {
          _id: string;
          name?: string;
          address?: string;
        };
      }
    | null;
  area:
    | string
    | {
        _id: string;
        name?: string;
        description?: string;
        campus?: {
          _id: string;
          name?: string;
          address?: string;
        };
      }
    | null;
  zoneType: "FUNCTIONAL" | "TECHNICAL" | "SERVICE" | "PUBLIC";
  floorLocation?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface QueryZoneDto {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  zoneType?: "FUNCTIONAL" | "TECHNICAL" | "SERVICE" | "PUBLIC";
  status?: "ACTIVE" | "INACTIVE" | "UNDERMAINTENANCE";
  campus?: string;
  building?: string;
  area?: string;
  floorLocation?: number;
}

export interface ZonesListResponse {
  zones: ZoneResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

/** ✅ Dữ liệu thống kê zone trả về từ API */
export interface ZoneStatsResponse {
  stats: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
}

// ============================
// API CALLS
// ============================

// Lấy tất cả zones
export const getZones = async (query?: QueryZoneDto) => {
  const res = await api.get<ApiResponse<ZonesListResponse>>(
    "/zone-area/zones",
    { params: query }
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

// ✅ Lấy thống kê khu vực (Zone Stats)
export const getZoneStats = async (): Promise<ZoneStatsResponse> => {
  const res = await api.get<ApiResponse<ZoneStatsResponse>>(
    "/zone-area/zones-stats"
  );

  // Đảm bảo luôn trả về giá trị mặc định, tránh undefined
  return (
    res.data.data ?? {
      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        newThisMonth: 0,
      },
    }
  );
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
