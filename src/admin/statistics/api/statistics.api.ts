import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

// Reports by Period
export interface ReportsByPeriodData {
  period: "week" | "month" | "year";
  chartData: Array<{
    period: string;
    count: number;
  }>;
  total: number;
}

export const getReportsByPeriod = async (params?: {
  period?: "week" | "month" | "year";
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<ReportsByPeriodData>> => {
  const response = await api.get("/statistics/reports/by-period", { params });
  return response.data;
};

// Reports by Type
export interface ReportTypeData {
  type: string;
  label: string;
  count: number;
  percentage: number;
}

export interface ReportsByTypeData {
  chartData: ReportTypeData[];
  total: number;
}

export const getReportsByType = async (): Promise<
  ApiResponse<ReportsByTypeData>
> => {
  const response = await api.get("/statistics/reports/by-type");
  return response.data;
};

// Audits by Staff
export interface AuditByStaffData {
  staffId: string;
  staffName: string;
  staffEmail: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

export const getAuditsByStaff = async (): Promise<
  ApiResponse<AuditByStaffData[]>
> => {
  const response = await api.get("/statistics/audits/by-staff");
  return response.data;
};

// Overall Statistics
export interface OverallStatisticsData {
  totalReports: number;
  totalAssets: number;
  totalAuditLogs: number;
  completedAuditLogs: number;
  completionRate: number;
  resolutionRate: number;
}

export const getOverallStatistics = async (): Promise<
  ApiResponse<OverallStatisticsData>
> => {
  const response = await api.get("/statistics/overall");
  return response.data;
};

// Reports by Location
export interface ReportByLocationData {
  locationId: string;
  location: string;
  count: number;
}

export interface ReportsByLocationData {
  type: "area" | "building" | "zone";
  chartData: ReportByLocationData[];
  total: number;
}

export const getReportsByLocation = async (
  type: "area" | "building" | "zone"
): Promise<ApiResponse<ReportsByLocationData>> => {
  const response = await api.get(`/statistics/reports/by-location/${type}`);
  return response.data;
};
