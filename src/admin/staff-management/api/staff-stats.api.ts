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
  accountsByRole?: Array<{
    role: string;
    count: number;
  }>;
}

interface StaffStatsApiResponse {
  stats: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
  timeSeries?: Array<{
    period: string;
    totalAccounts: number;
    activeAccounts: number;
    inactiveAccounts: number;
  }>;
  accountsByRole?: Array<{
    role: string;
    count: number;
  }>;
}

export const getStaffStats = async (params?: {
  type?: "date" | "month" | "quarter" | "year" | "custom";
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<StaffStatistics>> => {
  const response = await api.get<ApiResponse<StaffStatsApiResponse>>(
    "/auth/accounts/staff-only/stats",
    { params }
  );

  // Transform API response to match StaffStatistics interface
  const apiData = response.data.data;

  if (!apiData) {
    return {
      ...response.data,
      data: {
        totalAccounts: 0,
        activeAccounts: 0,
        inactiveAccounts: 0,
        newAccountsThisMonth: 0,
        accountsByRole: [],
      },
    };
  }

  // Handle both cases: { stats: {...} } or direct fields
  const statsObj = apiData.stats || apiData;

  const transformedData: StaffStatistics = {
    totalAccounts: statsObj.total || (apiData as any).totalAccounts || 0,
    activeAccounts: statsObj.active || (apiData as any).activeAccounts || 0,
    inactiveAccounts:
      statsObj.inactive || (apiData as any).inactiveAccounts || 0,
    newAccountsThisMonth:
      statsObj.newThisMonth || (apiData as any).newAccountsThisMonth || 0,
    timeSeries: apiData.timeSeries,
    accountsByRole: apiData.accountsByRole || [],
  };

  return {
    ...response.data,
    data: transformedData,
  };
};
