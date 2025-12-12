import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { BaseQueryDto } from "@/types/pagination.type";
import type { Report, ReportPriority } from "../types/report.type";

// Suggested Staff types
export interface SuggestedStaff {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string;
  assignedTo: "zone" | "building" | "zoneManaged" | "buildingManaged";
}

export interface SuggestedStaffsResponse {
  data: SuggestedStaff[];
}

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
  asset: ReportApiAsset | null;
  type: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  priority?: ReportPriority;
  description: string;
  images: string[];
  suggestedProcessingDays?: number; // AI suggested processing days
  rejectReason?: string; // Lý do từ chối (nếu có)
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
  status: "PENDING" | "APPROVED" | "REJECTED",
  rejectReason?: string
) => {
  const response = await api.patch<ApiResponse>(`/report/${reportId}/status`, {
    status,
    ...(rejectReason && { rejectReason }),
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

/**
 * Get suggested staffs for a report based on zone/building
 * @param reportId - The ID of the report
 * @returns Suggested staffs list
 */
export const getSuggestedStaffs = async (
  reportId: string
): Promise<ApiResponse<SuggestedStaffsResponse>> => {
  const response = await api.get<ApiResponse<SuggestedStaffsResponse>>(
    `/report/${reportId}/suggested-staffs`
  );
  console.log("[API: SUGGESTED STAFFS]:", response.data);
  return response.data;
};

export const approveReport = async (data: ApproveReportDto) => {
  const response = await api.post<ApiResponse>("/report/approve", data);
  console.log("[API: APPROVE REPORT]:", response.data);
  return response.data;
};

// ==================== Statistics API Types ====================

// Period Statistics Response
export interface PeriodStatisticsResponse {
  period: "month" | "quarter" | "year";
  startDate: string;
  endDate: string;
  reports: {
    total: number;
    byStatus: {
      PENDING?: number;
      APPROVED?: number;
      REJECTED?: number;
      RESOLVED?: number;
      CLOSED?: number;
    };
    byType: {
      ISSUE?: number;
      MAINTENANCE?: number;
      REQUEST?: number;
    };
    byPriority: {
      LOW?: number;
      MEDIUM?: number;
      HIGH?: number;
      CRITICAL?: number;
    };
    resolved: number;
    pending: number;
    inProgress: number;
  };
  audits: {
    total: number;
    byStatus: {
      PENDING?: number;
      COMPLETED?: number;
      OVERDUE?: number;
    };
    completed: number;
    pending: number;
    overdue: number;
  };
  performance: {
    averageResolutionTime: number;
    averageProcessingTime: number;
    resolutionRate: number;
  };
}

// Time Series Response
export interface TimeSeriesItem {
  date: string;
  total: number;
  byStatus: {
    PENDING?: number;
    APPROVED?: number;
    RESOLVED?: number;
    CLOSED?: number;
  };
  byType: {
    ISSUE?: number;
    MAINTENANCE?: number;
    REQUEST?: number;
  };
  byPriority: {
    LOW?: number;
    MEDIUM?: number;
    HIGH?: number;
    CRITICAL?: number;
  };
}

// By Location Response
export interface LocationStatisticsItem {
  locationId: string;
  locationName: string;
  total: number;
  byStatus: {
    PENDING?: number;
    APPROVED?: number;
    RESOLVED?: number;
    CLOSED?: number;
  };
  byType: {
    ISSUE?: number;
    MAINTENANCE?: number;
    REQUEST?: number;
  };
  byPriority: {
    LOW?: number;
    MEDIUM?: number;
    HIGH?: number;
    CRITICAL?: number;
  };
}

// Top Asset Response
export interface TopAssetItem {
  assetId: string;
  assetName: string;
  assetCode: string;
  totalReports: number;
  byStatus: {
    PENDING?: number;
    APPROVED?: number;
    RESOLVED?: number;
    CLOSED?: number;
  };
  byType: {
    ISSUE?: number;
    MAINTENANCE?: number;
    REQUEST?: number;
  };
}

// Top Reporter Response
export interface TopReporterItem {
  userId: string;
  userName: string;
  userEmail: string;
  totalReports: number;
  byType: {
    ISSUE?: number;
    MAINTENANCE?: number;
    REQUEST?: number;
  };
}

// ==================== Statistics API Functions ====================

// Get period statistics
export const getReportStatisticsByPeriod = async (params?: {
  period?: "month" | "quarter" | "year";
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.get<ApiResponse<PeriodStatisticsResponse>>(
    "/automation/statistics",
    {
      params: {
        period: params?.period || "month",
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    }
  );
  console.log("[API: GET PERIOD STATISTICS]:", response.data);
  return response.data;
};

// Get time series statistics
export const getReportTimeSeries = async (params?: {
  type: "daily" | "weekly" | "monthly";
  startDate?: string;
  endDate?: string;
  status?: string;
}) => {
  const response = await api.get<ApiResponse<TimeSeriesItem[]>>(
    "/report/statistics/time-series",
    {
      params: {
        type: params?.type || "daily",
        startDate: params?.startDate,
        endDate: params?.endDate,
        status: params?.status,
      },
    }
  );
  console.log("[API: GET TIME SERIES]:", response.data);
  return response.data;
};

// Get statistics by location
export const getReportStatisticsByLocation = async (params?: {
  groupBy: "campus" | "building" | "area" | "zone";
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.get<ApiResponse<LocationStatisticsItem[]>>(
    "/report/statistics/by-location",
    {
      params: {
        groupBy: params?.groupBy || "campus",
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    }
  );
  console.log("[API: GET STATISTICS BY LOCATION]:", response.data);
  return response.data;
};

// Get top assets
export const getTopAssets = async (params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.get<ApiResponse<TopAssetItem[]>>(
    "/report/statistics/top-assets",
    {
      params: {
        limit: params?.limit || 10,
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    }
  );
  console.log("[API: GET TOP ASSETS]:", response.data);
  return response.data;
};

// Get top reporters
export const getTopReporters = async (params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
}) => {
  const response = await api.get<ApiResponse<TopReporterItem[]>>(
    "/report/statistics/top-reporters",
    {
      params: {
        limit: params?.limit || 10,
        startDate: params?.startDate,
        endDate: params?.endDate,
      },
    }
  );
  console.log("[API: GET TOP REPORTERS]:", response.data);
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
    if (!apiReport.asset) {
      return {
        campus: "Chưa xác định",
      };
    }
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
    asset: apiReport.asset
      ? {
          _id: apiReport.asset._id,
          name: apiReport.asset.name,
          code: apiReport.asset.code,
          status: apiReport.asset.status,
          zone: apiReport.asset.zone,
          area: apiReport.asset.area,
          image: apiReport.asset.image, // Giữ nguyên path
        }
      : null,
    type: apiReport.type,
    status: apiReport.status,
    priority: apiReport.priority,
    description: apiReport.description,
    images: apiReport.images, // Giữ nguyên paths
    suggestedProcessingDays: apiReport.suggestedProcessingDays,
    rejectReason: apiReport.rejectReason, // Lý do từ chối (nếu có)
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
