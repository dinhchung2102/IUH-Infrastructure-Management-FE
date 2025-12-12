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
 * Response structure: { success, message, data: { data: AssetDashboardStats } }
 */
export const getAssetStatsDashboard = async (): Promise<
  ApiResponse<AssetDashboardStats>
> => {
  const res = await api.get<
    ApiResponse<{ data: AssetDashboardStats } | AssetDashboardStats>
  >("/assets/statistics/dashboard");

  // Transform nested response to match expected format
  // Response structure: { success, message, data: { data: AssetDashboardStats } }
  const responseData = res.data;

  if (responseData.success && responseData.data) {
    // Type guard to check if data is nested: { data: AssetDashboardStats }
    const innerData = responseData.data;

    // Check if data is nested: data.data (API returns { data: { data: AssetDashboardStats } })
    // Check if innerData is an object with a 'data' property that contains AssetDashboardStats
    if (
      typeof innerData === "object" &&
      innerData !== null &&
      "data" in innerData &&
      innerData.data &&
      typeof innerData.data === "object" &&
      "totalAssets" in innerData.data
    ) {
      const nestedData = innerData as { data: AssetDashboardStats };
      console.log("[Asset Stats API] Extracted nested data:", nestedData.data);
      return {
        success: responseData.success,
        message: responseData.message,
        data: nestedData.data,
      } as ApiResponse<AssetDashboardStats>;
    }

    // If data is directly AssetDashboardStats
    if (
      typeof innerData === "object" &&
      innerData !== null &&
      "totalAssets" in innerData &&
      !("data" in innerData)
    ) {
      console.log("[Asset Stats API] Using direct data:", innerData);
      return {
        success: responseData.success,
        message: responseData.message,
        data: innerData as AssetDashboardStats,
      } as ApiResponse<AssetDashboardStats>;
    }
  }

  // Return error if structure is unexpected
  console.error("Unexpected response structure from stats API:", responseData);
  // Return empty stats instead of throwing to prevent app crash
  return {
    success: false,
    message: "Unexpected response structure",
    data: {
      totalAssets: 0,
      assetsByStatus: {
        NEW: 0,
        IN_USE: 0,
        UNDER_MAINTENANCE: 0,
        DAMAGED: 0,
        LOST: 0,
        DISPOSED: 0,
        TRANSFERRED: 0,
      },
      assetsByCategory: [],
      assetsByType: [],
      assetsByLocation: { zones: 0, areas: 0 },
      assetsByCampus: [],
      assetsThisMonth: 0,
      assetsLastMonth: 0,
      growthRate: 0,
      warrantyExpiringSoon: 0,
      warrantyExpired: 0,
      maintenanceOverdue: 0,
      averageAssetAge: 0,
    } as AssetDashboardStats,
  } as ApiResponse<AssetDashboardStats>;
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
