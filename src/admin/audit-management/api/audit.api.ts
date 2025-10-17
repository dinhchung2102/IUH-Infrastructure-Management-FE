import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { BaseQueryDto } from "@/types/pagination.type";
import type { AuditLog } from "../types/audit.type";

// Response types từ API
export interface AuditLogApiResponse {
  _id: string;
  report: {
    _id: string;
    asset: {
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
    };
    type: string;
    status: string;
    description: string;
    images: string[];
    createdBy: {
      _id: string;
      fullName: string;
      email: string;
    };
  };
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

// Lấy thống kê audit logs
export const getAuditStats = async () => {
  const response = await api.get<
    ApiResponse<{
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
      cancelled: number;
      todayAudits: number;
    }>
  >("/audit/stats");
  console.log("[API: GET AUDIT STATS]:", response.data);
  return response.data;
};

// Utility function: Transform API response sang UI format
export const transformAuditLogApiToUI = (
  apiAuditLog: AuditLogApiResponse
): AuditLog => {
  // Helper function to build location object
  const buildLocation = () => {
    if (apiAuditLog.report.asset.zone) {
      return {
        campus: apiAuditLog.report.asset.zone.building.campus.name,
        building: apiAuditLog.report.asset.zone.building.name,
        zone: apiAuditLog.report.asset.zone.name,
      };
    } else if (apiAuditLog.report.asset.area) {
      return {
        campus: apiAuditLog.report.asset.area.campus.name,
        zone: apiAuditLog.report.asset.area.name,
      };
    }
    return {
      campus: "Chưa xác định",
    };
  };

  return {
    _id: apiAuditLog._id,
    report: {
      ...apiAuditLog.report,
      images: apiAuditLog.report.images, // Giữ nguyên paths
      asset: {
        ...apiAuditLog.report.asset,
        image: apiAuditLog.report.asset.image, // Giữ nguyên path
      },
    },
    status: apiAuditLog.status,
    subject: apiAuditLog.subject,
    staffs: apiAuditLog.staffs,
    images: apiAuditLog.images, // Giữ nguyên paths
    createdAt: apiAuditLog.createdAt,
    updatedAt: apiAuditLog.updatedAt,
    location: buildLocation(),
  };
};
