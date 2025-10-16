import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface CampusResponse {
  id: string;
  name: string;
  code: string;
  address: string;
  phone?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryCampusDto {
  keyword?: string;
  page?: number;
  limit?: number;
}

export interface CampusStatistics {
  totalCampus: number;
  totalRooms: number;
  totalAreas: number;
  createdThisMonth: number;
  timeSeries?: Array<{
    period: string;
    totalCampus: number;
  }>;
}

// ============================
// API CALLS
// ============================
export const getCampus = async (query?: QueryCampusDto) => {
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
}) => {
  const res = await api.get<ApiResponse<CampusStatistics>>("/campus/stats", {
    params,
  });
  return res.data;
};
