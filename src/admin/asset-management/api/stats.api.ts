import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

// ============================
// TYPE DEFINITIONS
// ============================

// 1️⃣ Dashboard Statistics
export interface AssetDashboardStats {
  totalAssets: number;
  assetsByStatus: {
    NEW: number;
    IN_USE: number;
    UNDER_MAINTENANCE: number;
    DAMAGED: number;
    LOST: number;
    DISPOSED: number;
    TRANSFERRED: number;
  };
  assetsByCategory: {
    _id: string;
    name: string;
    count: number;
    inUse: number;
    underMaintenance: number;
    damaged: number;
  }[];
  assetsByType: {
    _id: string;
    name: string;
    count: number;
    inUse: number;
    underMaintenance: number;
  }[];
  assetsByLocation: {
    zones: number;
    areas: number;
  };
  assetsByCampus: {
    name: string;
    count: number;
    inUse: number;
  }[];
  assetsThisMonth: number;
  assetsLastMonth: number;
  growthRate: number;
  warrantyExpiringSoon: number;
  warrantyExpired: number;
  maintenanceOverdue: number;
  averageAssetAge: number;
}

// 2️⃣ Category Statistics
export interface AssetCategoryStats {
  _id: string;
  name: string;
  image?: string;
  totalAssets: number;
  new: number;
  inUse: number;
  underMaintenance: number;
  damaged: number;
  lost: number;
  disposed: number;
  transferred: number;
}

// 3️⃣ Type Statistics
export interface AssetTypeStats {
  _id: string;
  name: string;
  categoryName: string;
  totalAssets: number;
  new: number;
  inUse: number;
  underMaintenance: number;
  damaged: number;
  lost: number;
  disposed: number;
  transferred: number;
}
export interface AssetStatsCardsProps {
  stats?: AssetDashboardStats;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

// 4️⃣ Location Statistics
export interface AssetLocationStats {
  byZones: {
    _id: string;
    zoneName: string;
    buildingName: string;
    campusName: string;
    totalAssets: number;
    inUse: number;
    underMaintenance: number;
    damaged: number;
  }[];
  byAreas: {
    _id: string;
    areaName: string;
    campusName: string;
    totalAssets: number;
    inUse: number;
    underMaintenance: number;
    damaged: number;
  }[];
}

// 5️⃣ Maintenance & Warranty Statistics
export interface AssetMaintenanceWarrantyStats {
  warrantyExpiring: number;
  warrantyExpired: number;
  maintenanceOverdue: number;
  recentlyMaintained: number;
  neverMaintained: number;
}

// ============================
// API CALLS
// ============================

/**
 * 1️⃣ Lấy thống kê tổng quan Dashboard
 * Endpoint: GET /assets/statistics/dashboard
 */
export const getAssetStatsDashboard = async () => {
  const res = await api.get<ApiResponse<AssetDashboardStats>>(
    "/assets/statistics/dashboard"
  );
  return res.data;
};

/**
 * 2️⃣ Lấy thống kê theo Category
 * Endpoint: GET /assets/statistics/categories
 */
export const getAssetStatsByCategory = async () => {
  const res = await api.get<ApiResponse<AssetCategoryStats[]>>(
    "/assets/statistics/categories"
  );
  return res.data;
};

/**
 * 3️⃣ Lấy thống kê theo Type (có thể lọc theo categoryId)
 * Endpoint: GET /assets/statistics/types
 */
export const getAssetStatsByType = async (categoryId?: string) => {
  const res = await api.get<ApiResponse<AssetTypeStats[]>>(
    "/assets/statistics/types",
    { params: categoryId ? { categoryId } : {} }
  );
  return res.data;
};

/**
 * 4️⃣ Lấy thống kê theo Location (zones & areas)
 * Endpoint: GET /assets/statistics/locations
 */
export const getAssetStatsByLocation = async () => {
  const res = await api.get<ApiResponse<AssetLocationStats>>(
    "/assets/statistics/locations"
  );
  return res.data;
};

/**
 * 5️⃣ Lấy thống kê bảo trì & bảo hành
 * Endpoint: GET /assets/statistics/maintenance-warranty
 */
export const getAssetStatsMaintenanceWarranty = async () => {
  const res = await api.get<ApiResponse<AssetMaintenanceWarrantyStats>>(
    "/assets/statistics/maintenance-warranty"
  );
  return res.data;
};
