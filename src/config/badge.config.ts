import React from "react";
import { Badge } from "@/components/ui/badge";
import type { AuditStatus } from "@/admin/audit-management/types/audit.type";
import type { ReportStatus } from "@/admin/report-management/types/report.type";
import type { NewsStatus } from "@/admin/news-management/types/news.type";
import type { RoleName } from "@/types/role.enum";
import { AssetStatus } from "@/types/asset-status.enum";

/**
 * Badge configuration for all statuses, types, and priorities in the application
 * This centralized config makes it easy to maintain and update badge styles
 */

// Badge style configuration
export type BadgeStyle = {
  label: string;
  className: string;
  variant?: "default" | "secondary" | "destructive" | "success" | "outline";
};

// Audit Status Badge Config
export const AUDIT_STATUS_BADGE: Record<AuditStatus, BadgeStyle> = {
  PENDING: {
    label: "Chờ xử lý",
    className:
      "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
    variant: "outline",
  },
  IN_PROGRESS: {
    label: "Đang xử lý",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    variant: "outline",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "outline",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "outline",
  },
};

// Report Status Badge Config
export const REPORT_STATUS_BADGE: Record<
  ReportStatus | "RESOLVED",
  BadgeStyle
> = {
  PENDING: {
    label: "Chờ xử lý",
    className:
      "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
    variant: "outline",
  },
  APPROVED: {
    label: "Đã duyệt",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "outline",
  },
  REJECTED: {
    label: "Đã từ chối",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "outline",
  },
  RESOLVED: {
    label: "Đã xử lý",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    variant: "outline",
  },
};

// Report Type Badge Config
export type ReportType =
  | "DAMAGED"
  | "MAINTENANCE"
  | "LOST"
  | "BUY_NEW"
  | "OTHER";

export const REPORT_TYPE_BADGE: Record<ReportType, BadgeStyle> = {
  DAMAGED: {
    label: "Hư hỏng",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "outline",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    variant: "outline",
  },
  LOST: {
    label: "Mất thiết bị",
    className:
      "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
    variant: "outline",
  },
  BUY_NEW: {
    label: "Mua mới",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "outline",
  },
  OTHER: {
    label: "Khác",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    variant: "outline",
  },
};

// Asset Status Badge Config
export const ASSET_STATUS_BADGE: Record<AssetStatus, BadgeStyle> = {
  NEW: {
    label: "Mới",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    variant: "outline",
  },
  IN_USE: {
    label: "Đang sử dụng",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "outline",
  },
  UNDER_MAINTENANCE: {
    label: "Đang bảo trì",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    variant: "outline",
  },
  DAMAGED: {
    label: "Hư hỏng",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "outline",
  },
  LOST: {
    label: "Mất",
    className:
      "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
    variant: "outline",
  },
  DISPOSED: {
    label: "Đã thanh lý",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    variant: "outline",
  },
  TRANSFERRED: {
    label: "Đã chuyển giao",
    className:
      "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200",
    variant: "outline",
  },
};

// News Status Badge Config
export const NEWS_STATUS_BADGE: Record<NewsStatus, BadgeStyle> = {
  PUBLISHED: {
    label: "Đã xuất bản",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
    variant: "outline",
  },
  DRAFT: {
    label: "Bản nháp",
    className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    variant: "outline",
  },
};

// Priority Badge Config
export type Priority = "HIGH" | "MEDIUM" | "LOW" | "CRITICAL";

export const PRIORITY_BADGE: Record<Priority, BadgeStyle> = {
  CRITICAL: {
    label: "Khẩn cấp",
    className: "bg-red-600 text-white hover:bg-red-600 border-red-700",
    variant: "destructive",
  },
  HIGH: {
    label: "Cao",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "destructive",
  },
  MEDIUM: {
    label: "Trung bình",
    className:
      "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300",
    variant: "secondary",
  },
  LOW: {
    label: "Thấp",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    variant: "outline",
  },
};

// Maintenance Status Badge Config (for maintenance module)
export type MaintenanceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

export const MAINTENANCE_STATUS_BADGE: Record<MaintenanceStatus, BadgeStyle> = {
  PENDING: {
    label: "Chờ thực hiện",
    className:
      "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300",
    variant: "secondary",
  },
  IN_PROGRESS: {
    label: "Đang thực hiện",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    variant: "outline",
  },
  COMPLETED: {
    label: "Hoàn thành",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "success",
  },
  CANCELLED: {
    label: "Đã hủy",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "destructive",
  },
  OVERDUE: {
    label: "Quá hạn",
    className: "bg-red-600 text-white hover:bg-red-600 border-red-700",
    variant: "destructive",
  },
};

/**
 * Helper function to get badge config by key
 */
export function getBadgeConfig<T extends string>(
  config: Record<T, BadgeStyle>,
  key: T | string
): BadgeStyle {
  const badgeConfig = config[key as T];
  if (badgeConfig) {
    return badgeConfig;
  }
  // Default fallback
  return {
    label: String(key),
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    variant: "outline",
  };
}

/**
 * Helper function to render a badge component from config
 */
export function renderBadge(config: BadgeStyle, className?: string) {
  return React.createElement(
    Badge,
    {
      variant: config.variant || "outline",
      className: config.className + (className ? ` ${className}` : ""),
    },
    config.label
  );
}

/**
 * Helper functions for each badge type
 */
export function getAuditStatusBadge(status: AuditStatus) {
  return renderBadge(getBadgeConfig(AUDIT_STATUS_BADGE, status));
}

export function getReportStatusBadge(status: ReportStatus | "RESOLVED") {
  return renderBadge(getBadgeConfig(REPORT_STATUS_BADGE, status));
}

export function getReportTypeBadge(type: string) {
  return renderBadge(getBadgeConfig(REPORT_TYPE_BADGE, type as ReportType));
}

export function getAssetStatusBadge(status: string) {
  return renderBadge(getBadgeConfig(ASSET_STATUS_BADGE, status as AssetStatus));
}

export function getNewsStatusBadge(status: NewsStatus) {
  return renderBadge(getBadgeConfig(NEWS_STATUS_BADGE, status));
}

export function getPriorityBadge(priority: Priority | string) {
  return renderBadge(getBadgeConfig(PRIORITY_BADGE, priority as Priority));
}

export function getMaintenanceStatusBadge(status: MaintenanceStatus | string) {
  return renderBadge(
    getBadgeConfig(MAINTENANCE_STATUS_BADGE, status as MaintenanceStatus)
  );
}

// Active/Inactive Status Badge Config (for campus, building, zone, etc.)
export type ActiveStatus = "ACTIVE" | "INACTIVE" | "UNDERMAINTENANCE";

export const ACTIVE_STATUS_BADGE: Record<ActiveStatus, BadgeStyle> = {
  ACTIVE: {
    label: "Hoạt động",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "success",
  },
  INACTIVE: {
    label: "Ngừng hoạt động",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "destructive",
  },
  UNDERMAINTENANCE: {
    label: "Bảo trì",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    variant: "secondary",
  },
};

// Account/Staff Status Badge Config (isActive boolean)
export const ACCOUNT_STATUS_BADGE = {
  ACTIVE: {
    label: "Hoạt động",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "default" as const,
  },
  INACTIVE: {
    label: "Đã khóa",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "destructive" as const,
  },
};

// Building/Area Type Badge Config
export type BuildingAreaType = "BUILDING" | "AREA";

export const BUILDING_AREA_TYPE_BADGE: Record<BuildingAreaType, BadgeStyle> = {
  BUILDING: {
    label: "Tòa nhà",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    variant: "secondary",
  },
  AREA: {
    label: "Khu vực ngoài trời",
    className:
      "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
    variant: "outline",
  },
};

/**
 * Helper functions for new badge types
 */
export function getActiveStatusBadge(status: ActiveStatus | string) {
  return renderBadge(
    getBadgeConfig(ACTIVE_STATUS_BADGE, status as ActiveStatus)
  );
}

export function getAccountStatusBadge(isActive: boolean) {
  const status = isActive ? "ACTIVE" : "INACTIVE";
  return renderBadge(ACCOUNT_STATUS_BADGE[status], "text-xs");
}

export function getBuildingAreaTypeBadge(type: BuildingAreaType | string) {
  return renderBadge(
    getBadgeConfig(BUILDING_AREA_TYPE_BADGE, type as BuildingAreaType)
  );
}

// Role Badge Config
export const ROLE_BADGE: Record<RoleName, BadgeStyle> = {
  ADMIN: {
    label: "Quản trị viên",
    className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    variant: "outline",
  },
  CAMPUS_ADMIN: {
    label: "Quản trị cơ sở",
    className:
      "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
    variant: "outline",
  },
  STAFF: {
    label: "Nhân viên",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    variant: "outline",
  },
  LECTURER: {
    label: "Giảng viên",
    className:
      "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    variant: "outline",
  },
  STUDENT: {
    label: "Sinh viên",
    className:
      "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    variant: "outline",
  },
  GUEST: {
    label: "Khách",
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    variant: "outline",
  },
};

export function getRoleBadge(role: RoleName | string) {
  return renderBadge(getBadgeConfig(ROLE_BADGE, role as RoleName), "text-xs");
}
