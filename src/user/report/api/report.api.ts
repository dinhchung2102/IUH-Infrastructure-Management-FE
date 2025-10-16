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

export type { ReportType };
