import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface CampusResponse {
  _id: string;
  name: string;
  code: string;
  address: string;
  phone?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";
  email?: string;
  manager?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface QueryCampusDto {
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface CampusStatistics {
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
export const getCampus = async (
  query?: QueryCampusDto
): Promise<ApiResponse<{ campuses: CampusResponse[] }>> => {
  const res = await api.get<ApiResponse<{ campuses: CampusResponse[] }>>(
    "/campus",
    {
      params: query,
    }
  );
  return res.data;
};

export const getCampusById = async (id: string) => {
  const res = await api.get<ApiResponse<CampusResponse>>(`/campus/${id}`);
  return res.data;
};

export const createCampus = async (data: Partial<CampusResponse>) => {
  const res = await api.post<ApiResponse<CampusResponse>>("/campus", data);
  return res.data;
};

export const updateCampus = async (
  id: string,
  data: Partial<CampusResponse>
) => {
  const res = await api.patch<ApiResponse<CampusResponse>>(
    `/campus/${id}`,
    data
  );
  return res.data;
};

export const deleteCampus = async (id: string) => {
  const res = await api.delete<ApiResponse<void>>(`/campus/${id}`);
  return res.data;
};

export const getCampusStats = async (params?: {
  type?: "date" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<CampusStatistics>> => {
  const res = await api.get<ApiResponse<CampusStatistics>>("/campus/stats", {
    params,
  });
  return res.data;
};
