import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { PaginationResponse } from "@/types/pagination.type";

// ============================
// TYPE DEFINITIONS
// ============================

export interface AssetResponse {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: "IN_USE" | "MAINTENANCE" | "RETIRED" | "DISPOSED";
  assetType?: string;
  assetCategory?: string;
  image?: string;
  zone?: {
    _id: string;
    name: string;
  };
  area?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface QueryAssetDto {
  search?: string; // Changed from keyword to search
  page?: number;
  limit?: number;
  status?: string;
  assetType?: string; // Added assetType
  zone?: string; // Changed from zoneId to zone
  areaId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AssetsResponse {
  assets: AssetResponse[];
  pagination: PaginationResponse;
}

// ============================
// API CALLS
// ============================

/**
 * Lấy danh sách tài sản (có thể filter, phân trang)
 */
export const getAssets = async (query?: QueryAssetDto) => {
  const res = await api.get<ApiResponse<AssetsResponse>>("/assets", {
    params: query,
  });
  return res.data;
};

/**
 * Lấy thông tin chi tiết tài sản theo ID
 */
export const getAssetById = async (id: string) => {
  const res = await api.get<ApiResponse<AssetResponse>>(`/assets/${id}`);
  return res.data;
};

/**
 * Tạo tài sản mới
 */
export const createAsset = async (data: Partial<AssetResponse> | FormData) => {
  const res = await api.post<ApiResponse<AssetResponse>>("/assets", data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return res.data;
};

/**
 * Cập nhật thông tin tài sản
 */
export const updateAsset = async (
  id: string,
  data: Partial<AssetResponse> | FormData
) => {
  const res = await api.patch<ApiResponse<AssetResponse>>(
    `/assets/${id}`,
    data,
    {
      headers:
        data instanceof FormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
    }
  );
  return res.data;
};

/**
 * Xóa tài sản
 */
export const deleteAsset = async (id: string) => {
  const res = await api.delete<ApiResponse<void>>(`/assets/${id}`);
  return res.data;
};

/**
 * Lấy danh sách tài sản theo zoneId
 */
export const getAssetsByZoneId = async (zoneId: string) => {
  const res = await api.get<ApiResponse<{ assets: AssetResponse[] }>>(
    `/assets/zone/${zoneId}`
  );
  return res.data;
};

/**
 * Lấy danh sách tài sản theo areaId
 */
export const getAssetsByAreaId = async (areaId: string) => {
  const res = await api.get<ApiResponse<{ assets: AssetResponse[] }>>(
    `/assets/area/${areaId}`
  );
  return res.data;
};
export const getAssetStats = async () => {
  const res = await api.get<
    ApiResponse<{
      stats: {
        total: number;
        inUse: number;
        maintenance: number;
        broken: number;
      };
    }>
  >("/assets/stats");
  return res.data;
};
