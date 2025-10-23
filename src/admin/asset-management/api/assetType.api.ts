import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

// ============================
// TYPE DEFINITIONS
// ============================

export interface AssetTypeResponse {
  _id: string;
  name: string;
  code: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface QueryAssetTypeDto {
  keyword?: string;
  page?: number;
  limit?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ============================
// API CALLS
// ============================

/**
 * Lấy danh sách loại tài sản (Asset Type)
 */
export const getAssetTypes = async (query?: QueryAssetTypeDto) => {
  const res = await api.get<ApiResponse<{ assetTypes: AssetTypeResponse[] }>>(
    "/assets/types",
    { params: query }
  );
  return res.data;
};

/**
 * Lấy thông tin loại tài sản theo ID
 */
export const getAssetTypeById = async (id: string) => {
  const res = await api.get<ApiResponse<AssetTypeResponse>>(`/assets/types/${id}`);
  return res.data;
};

/**
 * Tạo loại tài sản mới
 */
export const createAssetType = async (data: Partial<AssetTypeResponse>) => {
  const res = await api.post<ApiResponse<AssetTypeResponse>>("/assets/types", data);
  return res.data;
};

/**
 * Cập nhật loại tài sản
 */
export const updateAssetType = async (
  id: string,
  data: Partial<AssetTypeResponse>
) => {
  const res = await api.patch<ApiResponse<AssetTypeResponse>>(
    `/assets/types/${id}`,
    data
  );
  return res.data;
};

/**
 * Xóa loại tài sản
 */
export const deleteAssetType = async (id: string) => {
  const res = await api.delete<ApiResponse<void>>(`/assets/types/${id}`);
  return res.data;
};
