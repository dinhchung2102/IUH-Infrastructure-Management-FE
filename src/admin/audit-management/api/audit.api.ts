import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { BaseQueryDto } from "@/types/pagination.type";
import type { AuditLog } from "../types/audit.type";

// Asset info structure (can be full object or just ID)
export interface AssetInfo {
  _id: string;
  name: string;
  code: string;
  status: string;
  image?: string;
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

// Response types từ API
export interface AuditLogApiResponse {
  _id: string;
  report?: {
    _id: string;
    asset: AssetInfo;
    type: string;
    status: string;
    description: string;
    images: string[];
    createdBy: {
      _id: string;
      fullName: string;
      email: string;
    };
  } | null;
  asset?: string | AssetInfo; // Can be just ID or full object
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  subject: string;
  staffs: Array<{
    _id: string;
    fullName: string;
    email: string;
  }>;
  images: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface GetAuditLogsResponse {
  auditLogs: AuditLogApiResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface GetAuditLogsParams extends BaseQueryDto {
  search?: string;
  status?: string;
  campus?: string;
  zone?: string;
  startDate?: string;
  endDate?: string;
}

// Lấy danh sách audit logs
export const getAuditLogs = async (params?: GetAuditLogsParams) => {
  const response = await api.get<ApiResponse<GetAuditLogsResponse>>("/audit", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || undefined,
      status:
        params?.status && params.status !== "all" ? params.status : undefined,
      campus:
        params?.campus && params.campus !== "all" ? params.campus : undefined,
      zone: params?.zone && params.zone !== "all" ? params.zone : undefined,
      startDate: params?.startDate || undefined,
      endDate: params?.endDate || undefined,
    },
  });
  console.log("[API: GET AUDIT LOGS]:", response.data);
  return response.data;
};

// Cập nhật trạng thái audit log
export const updateAuditStatus = async (
  auditId: string,
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
) => {
  const response = await api.patch<ApiResponse>(`/audit/${auditId}/status`, {
    status,
  });
  console.log("[API: UPDATE AUDIT STATUS]:", response.data);
  return response.data;
};

// API Response type for stats
export interface AuditStatsApiResponse {
  totalAudits: number;
  auditsByStatus: {
    PENDING?: number;
    IN_PROGRESS?: number;
    COMPLETED?: number;
    CANCELLED?: number;
  };
  recentAudits: unknown[];
  auditsThisMonth: number;
  auditsLastMonth: number;
  averageCompletionTime: number;
}

// UI Stats type for Audit Management Page
export interface AuditStatsUI {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  todayAudits: number;
}

// Lấy thống kê audit logs
export const getAuditStats = async () => {
  const response = await api.get<ApiResponse<{ data: AuditStatsApiResponse }>>(
    "/audit/stats"
  );
  console.log("[API: GET AUDIT STATS]:", response.data);

  // Transform API response to UI format
  if (response.data.success && response.data.data?.data) {
    const apiData = response.data.data.data;
    const transformedStats: AuditStatsUI = {
      total: apiData.totalAudits || 0,
      pending: apiData.auditsByStatus?.PENDING || 0,
      inProgress: apiData.auditsByStatus?.IN_PROGRESS || 0,
      completed: apiData.auditsByStatus?.COMPLETED || 0,
      cancelled: apiData.auditsByStatus?.CANCELLED || 0,
      todayAudits: apiData.auditsThisMonth || 0,
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
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      todayAudits: 0,
    },
  };
};

// Create audit DTO
export interface CreateAuditDto {
  report?: string; // MongoID of report
  asset?: string; // MongoID of asset
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  subject: string;
  description?: string;
  staffs: string[]; // Array of staff IDs
  images?: string[]; // Array of image URLs or files
}

// Tạo audit mới
export const createAudit = async (data: CreateAuditDto) => {
  const response = await api.post<
    ApiResponse<{ message: string; auditLog: AuditLogApiResponse }>
  >("/audit", data);
  console.log("[API: CREATE AUDIT]:", response.data);
  return response.data;
};

// Utility function: Transform API response sang UI format
export const transformAuditLogApiToUI = (
  apiAuditLog: AuditLogApiResponse
): AuditLog => {
  // Helper function to build location object
  const buildLocation = () => {
    if (apiAuditLog.report?.asset.zone) {
      return {
        campus: apiAuditLog.report.asset.zone.building.campus.name,
        building: apiAuditLog.report.asset.zone.building.name,
        zone: apiAuditLog.report.asset.zone.name,
      };
    } else if (apiAuditLog.report?.asset.area) {
      return {
        campus: apiAuditLog.report.asset.area.campus.name,
        zone: apiAuditLog.report.asset.area.name,
      };
    }
    // If no report or no location info from asset
    if (
      typeof apiAuditLog.asset === "object" &&
      apiAuditLog.asset &&
      "zone" in apiAuditLog.asset &&
      apiAuditLog.asset.zone
    ) {
      return {
        campus: apiAuditLog.asset.zone.building.campus.name,
        building: apiAuditLog.asset.zone.building.name,
        zone: apiAuditLog.asset.zone.name,
      };
    } else if (
      typeof apiAuditLog.asset === "object" &&
      apiAuditLog.asset &&
      "area" in apiAuditLog.asset &&
      apiAuditLog.asset.area
    ) {
      return {
        campus: apiAuditLog.asset.area.campus.name,
        zone: apiAuditLog.asset.area.name,
      };
    }
    return {
      campus: "Chưa xác định",
    };
  };

  // Handle asset info
  let assetInfo;
  if (typeof apiAuditLog.asset === "object" && apiAuditLog.asset) {
    assetInfo = {
      _id: apiAuditLog.asset._id,
      name: apiAuditLog.asset.name,
      code: apiAuditLog.asset.code,
      status: apiAuditLog.asset.status,
      image: apiAuditLog.asset.image,
    };
  } else if (typeof apiAuditLog.asset === "string") {
    assetInfo = {
      _id: apiAuditLog.asset,
    };
  }

  return {
    _id: apiAuditLog._id,
    report: apiAuditLog.report
      ? {
          ...apiAuditLog.report,
          images: apiAuditLog.report.images, // Giữ nguyên paths
          asset: {
            ...apiAuditLog.report.asset,
            image: apiAuditLog.report.asset.image, // Giữ nguyên path
          },
        }
      : null,
    asset: assetInfo,
    status: apiAuditLog.status,
    subject: apiAuditLog.subject,
    staffs: apiAuditLog.staffs,
    images: apiAuditLog.images, // Giữ nguyên paths
    createdAt: apiAuditLog.createdAt,
    updatedAt: apiAuditLog.updatedAt,
    location: buildLocation(),
  };
};
