import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface StaffStatistics {
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  newAccountsThisMonth: number;
  timeSeries?: Array<{
    period: string;
    totalAccounts: number;
    activeAccounts: number;
    inactiveAccounts: number;
  }>;
  accountsByRole: Array<{
    role: string;
    count: number;
  }>;
}

export const getStaffStats = async (params?: {
  type?: "date" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<StaffStatistics>> => {
  const response = await api.get("/auth/accounts/staff-only/stats", { params });
  return response.data;
};
