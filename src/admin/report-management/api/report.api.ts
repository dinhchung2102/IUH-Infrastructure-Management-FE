import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { BaseQueryDto } from "@/types/pagination.type";
import type { Report, ReportPriority } from "../types/report.type";

// Response types từ API
export interface ReportApiAsset {
  _id: string;
  name: string;
  code: string;
  status: string;
  image?: string; // Optional - hình ảnh của thiết bị
  zone?: {
    _id: string;
    name: string;
    building: {
      _id: string;
      name: string;
      campus: {
        _id: string;
        name: string;
      };
    };
  } | null;
  area?: {
    _id: string;
    name: string;
    campus: {
      _id: string;
      name: string;
    };
  } | null;
}

export interface ReportApiCreatedBy {
  _id: string;
  email: string;
  fullName: string;
}

export interface ReportApiResponse {
  _id: string;
  asset: ReportApiAsset;
  type: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  priority?: ReportPriority;
  description: string;
  images: string[];
  suggestedProcessingDays?: number; // AI suggested processing days
  createdBy: ReportApiCreatedBy | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface GetReportsResponse {
  reports: ReportApiResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface GetReportsParams extends BaseQueryDto {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Lấy danh sách báo cáo
export const getReports = async (params?: GetReportsParams) => {
  const response = await api.get<ApiResponse<GetReportsResponse>>("/report", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || undefined,
      status:
        params?.status && params.status !== "all" ? params.status : undefined,
      type: params?.type && params.type !== "all" ? params.type : undefined,
      // Map dateFrom/dateTo to fromDate/toDate for BE API
      fromDate: params?.dateFrom || undefined,
      toDate: params?.dateTo || undefined,
    },
  });
  console.log("[API: GET REPORTS]:", response.data);
  return response.data;
};

// Cập nhật trạng thái báo cáo
export const updateReportStatus = async (
  reportId: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  const response = await api.patch<ApiResponse>(`/report/${reportId}/status`, {
    status,
  });
  console.log("[API: UPDATE REPORT STATUS]:", response.data);
  return response.data;
};

// API Response type for stats
export interface ReportStatsApiResponse {
  totalReports: number;
  reportsByStatus: {
    OPEN?: number;
    IN_PROGRESS?: number;
    RESOLVED?: number;
    CLOSED?: number;
    APPROVED?: number;
    PENDING?: number;
    REJECTED?: number;
  };
  reportsByType: Record<string, number>;
  reportsByPriority: Record<string, number>;
  recentReports: unknown[];
  reportsThisMonth: number;
  reportsLastMonth: number;
  averageResolutionTime: number;
}

// UI Stats type for Report Management Page
export interface ReportStatsUI {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todayReports: number;
  reportsThisMonth: number;
  reportsLastMonth: number;
  averageResolutionTime: number;
}

// Lấy thống kê báo cáo
export const getReportStats = async () => {
  const response = await api.get<ApiResponse<{ data: ReportStatsApiResponse }>>(
    "/report/stats"
  );
  console.log("[API: GET REPORT STATS]:", response.data);

  // Transform API response to UI format
  if (response.data.success && response.data.data?.data) {
    const apiData = response.data.data.data;
    const transformedStats: ReportStatsUI = {
      total: apiData.totalReports || 0,
      pending: apiData.reportsByStatus?.PENDING || 0,
      approved: apiData.reportsByStatus?.APPROVED || 0,
      rejected: apiData.reportsByStatus?.REJECTED || 0,
      todayReports: apiData.reportsThisMonth || 0,
      reportsThisMonth: apiData.reportsThisMonth || 0,
      reportsLastMonth: apiData.reportsLastMonth || 0,
      averageResolutionTime: apiData.averageResolutionTime || 0,
    };

    return {
      ...response.data,
      data: transformedStats,
    };
  }

  // Return default values if no data
  return {
    ...response.data,
    data: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      todayReports: 0,
      reportsThisMonth: 0,
      reportsLastMonth: 0,
      averageResolutionTime: 0,
    },
  };
};

// Phê duyệt báo cáo
export interface ApproveReportDto {
  reportId: string;
  staffIds: string[];
  subject: string;
  expiresAt?: string; // Expiration date (ISO string)
}

export const approveReport = async (data: ApproveReportDto) => {
  const response = await api.post<ApiResponse>("/report/approve", data);
  console.log("[API: APPROVE REPORT]:", response.data);
  return response.data;
};

// Utility function: Transform API response sang UI format
export const transformReportApiToUI = (
  apiReport: ReportApiResponse
): Report | null => {
  // Skip reports without createdBy (invalid data)
  if (!apiReport.createdBy) {
    console.warn(`Report ${apiReport._id} has no createdBy, skipping...`);
    return null;
  }

  // Helper function to build location object
  const buildLocation = () => {
    if (apiReport.asset.zone) {
      return {
        campus: apiReport.asset.zone.building.campus.name,
        building: apiReport.asset.zone.building.name,
        zone: apiReport.asset.zone.name,
      };
    } else if (apiReport.asset.area) {
      return {
        campus: apiReport.asset.area.campus.name,
        zone: apiReport.asset.area.name,
      };
    }
    return {
      campus: "Chưa xác định",
    };
  };

  return {
    _id: apiReport._id,
    asset: {
      _id: apiReport.asset._id,
      name: apiReport.asset.name,
      code: apiReport.asset.code,
      status: apiReport.asset.status,
      zone: apiReport.asset.zone,
      area: apiReport.asset.area,
      image: apiReport.asset.image, // Giữ nguyên path
    },
    type: apiReport.type,
    status: apiReport.status,
    priority: apiReport.priority,
    description: apiReport.description,
    images: apiReport.images, // Giữ nguyên paths
    suggestedProcessingDays: apiReport.suggestedProcessingDays,
    createdBy: {
      _id: apiReport.createdBy._id,
      fullName: apiReport.createdBy.fullName,
      email: apiReport.createdBy.email,
    },
    createdAt: apiReport.createdAt,
    updatedAt: apiReport.updatedAt,
    location: buildLocation(),
  };
};
