import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface AccountStatistics {
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

export const getAccountStats = async (params?: {
  type?: "date" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<AccountStatistics>> => {
  const response = await api.get("/auth/accounts/stats", { params });
  return response.data;
};
