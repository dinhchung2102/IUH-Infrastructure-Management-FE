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

export type { ReportType };
