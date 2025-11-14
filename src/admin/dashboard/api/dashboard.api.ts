import api from "@/lib/axios";
import type { DashboardResponse, DashboardData } from "../types/dashboard.type";

// Get dashboard stats and recent reports
export const getDashboardStats = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardResponse>("/dashboard/stats");
  // Response structure: { success, message, data: { stats, recentReports } }
  return response.data.data;
};

