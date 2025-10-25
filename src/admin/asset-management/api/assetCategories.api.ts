import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

// ============================
// TYPE DEFINITIONS
// ============================

export interface AssetCategoryResponse {
  _id: string;
  name: string;
  code: string;
  description?: string;
  image?: string; 
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface QueryAssetCategoryDto {
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
 * Lấy danh sách danh mục tài sản (Asset Category)
 */
export const getAssetCategories = async (query?: QueryAssetCategoryDto) => {
  const res = await api.get<ApiResponse<{ categories: AssetCategoryResponse[] }>>(
    "/assets/categories",
    { params: query }
  );
  return res.data;
};

/**
 * Lấy chi tiết danh mục tài sản theo ID
 */
export const getAssetCategoryById = async (id: string) => {
  const res = await api.get<ApiResponse<AssetCategoryResponse>>(
    `/assets/categories/${id}`
  );
  return res.data;
};

/**
 * Tạo danh mục tài sản mới
 */
export const createAssetCategory = async (
  data: Partial<AssetCategoryResponse> | FormData
) => {
  const isFormData = data instanceof FormData;

  const res = await api.post<ApiResponse<AssetCategoryResponse>>(
    "/assets/categories",
    data,
    {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    }
  );
  return res.data;
};


/**
 * Cập nhật danh mục tài sản
 */
/**
 * Cập nhật danh mục tài sản
 */
export const updateAssetCategory = async (
  id: string,
  data: Partial<AssetCategoryResponse> | FormData
) => {
  const isFormData = data instanceof FormData;

  const res = await api.patch<ApiResponse<AssetCategoryResponse>>(
    `/assets/categories/${id}`,
    data,
    {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    }
  );
  return res.data;
};


/**
 * Xóa danh mục tài sản
 */
export const deleteAssetCategory = async (id: string) => {
  const res = await api.delete<ApiResponse<void>>(`/assets/categories/${id}`);
  return res.data;
};
