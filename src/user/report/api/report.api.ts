import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { ReportType } from "../types/report.types";

export const getReportTypes = async () => {
  const response = await api.get<ApiResponse<{ reportTypes: ReportType[] }>>(
    "/report/types/list"
  );
  console.log("[API: REPORT TYPES]:", response.data);
  return response.data;
};

// Send OTP for report (for non-authenticated users)
export const sendReportOTP = async (email: string) => {
  const response = await api.post<ApiResponse>("/report/send-report-otp", {
    email,
  });
  console.log("[API: SEND REPORT OTP]:", response.data);
  return response.data;
};

// Create report with FormData (includes files)
export const createReport = async (formData: FormData) => {
  const response = await api.post<ApiResponse>("/report", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("[API: CREATE REPORT]:", response.data);
  return response.data;
};

// Get my reports with filters
export interface MyReportParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED";
  type?: "MAINTENANCE" | "DAMAGED" | "OTHER";
  fromDate?: string;
  toDate?: string;
}

export interface MyReportAsset {
  _id: string;
  name: string;
  code: string;
  zone?: {
    _id: string;
    name: string;
  };
  area?: {
    _id: string;
    name: string;
  };
}

export interface MyReportCreatedBy {
  _id: string;
  fullName: string;
  email: string;
}

export interface MyReport {
  _id: string;
  type: "MAINTENANCE" | "DAMAGED" | "OTHER";
  status: "PENDING" | "APPROVED" | "REJECTED" | "RESOLVED";
  description: string;
  images: string[];
  asset: MyReportAsset;
  createdBy: MyReportCreatedBy;
  createdAt: string;
  updatedAt: string;
}

export interface MyReportsResponse {
  reports: MyReport[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  summary: {
    total: number;
    byStatus: {
      PENDING: number;
      APPROVED: number;
      REJECTED: number;
      RESOLVED: number;
    };
    byType: {
      MAINTENANCE: number;
      DAMAGED: number;
      OTHER: number;
    };
  };
}

export const getMyReports = async (
  params?: MyReportParams
): Promise<ApiResponse<MyReportsResponse>> => {
  const queryParams = new URLSearchParams();

  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.type) queryParams.append("type", params.type);
  if (params?.fromDate) queryParams.append("fromDate", params.fromDate);
  if (params?.toDate) queryParams.append("toDate", params.toDate);

  const response = await api.get<ApiResponse<MyReportsResponse>>(
    `/report/my-reports?${queryParams.toString()}`
  );
  console.log("[API: GET MY REPORTS]:", response.data);
  return response.data;
};

export type { ReportType };
