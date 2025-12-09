import {
  getBuildings,
  getBuildingStats,
} from "@/admin/building-area/api/building.api";
import { getAreas, getAreaStats } from "@/admin/building-area/api/area.api";

import type { BuildingResponse } from "@/admin/building-area/api/building.api";
import type { AreaResponse } from "@/admin/building-area/api/area.api";

export type BuildingAreaItem = (BuildingResponse | AreaResponse) & {
  type: "BUILDING" | "AREA";
};

/* ========================================================
 * 🏗️ LẤY DANH SÁCH GỘP: TÒA NHÀ + KHU VỰC
 * ======================================================== */
export const getBuildingAreaList = async () => {
  try {
    const [buildRes, areaRes] = await Promise.all([getBuildings(), getAreas()]);

    const buildingsData = buildRes?.data?.buildings || buildRes?.data || [];
    const buildings = Array.isArray(buildingsData)
      ? buildingsData.map((b: BuildingResponse) => ({
          ...b,
          type: "BUILDING" as const,
        }))
      : buildingsData.buildings.map((b: BuildingResponse) => ({
          ...b,
          type: "BUILDING" as const,
        }));

    const areasData = areaRes?.data?.areas || areaRes?.data || [];
    const areas = Array.isArray(areasData)
      ? areasData.map((a: AreaResponse) => ({
          ...a,
          type: "AREA" as const,
        }))
      : areasData.areas.map((a: AreaResponse) => ({
          ...a,
          type: "AREA" as const,
        }));

    const merged: BuildingAreaItem[] = [...buildings, ...areas].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return merged;
  } catch (error) {
    console.error("[❌ BUILDING-AREA API] Lỗi khi tải dữ liệu:", error);
    throw error;
  }
};

/* ========================================================
 * 📊 LẤY THỐNG KÊ GỘP: TÒA NHÀ + KHU VỰC
 * ======================================================== */
export interface BuildingAreaStats {
  buildings: {
    stats: {
      total: number;
      active: number;
      inactive: number;
      underMaintenance: number;
      newThisMonth?: number;
    };
  };
  areas: {
    stats: {
      total: number;
      active: number;
      inactive: number;
      underMaintenance: number;
      newThisMonth?: number;
    };
  };
  totalAll: number;
  totalActive: number;
  totalInactive: number;
  totalUnderMaintenance: number;
}

export const getBuildingAreaStats = async (): Promise<BuildingAreaStats> => {
  try {
    const [buildingRes, areaRes] = await Promise.all([
      getBuildingStats(),
      getAreaStats(),
    ]);

    const buildingStats = buildingRes ?? {
      total: 0,
      active: 0,
      inactive: 0,
      underMaintenance: 0,
    };
    const areaStats = areaRes ?? {
      total: 0,
      active: 0,
      inactive: 0,
      underMaintenance: 0,
    };

    const totalAll = buildingStats.total + areaStats.total;
    const totalActive = buildingStats.active + areaStats.active;
    const totalInactive = buildingStats.inactive + areaStats.inactive;
    const totalUnderMaintenance =
      buildingStats.underMaintenance + areaStats.underMaintenance;

    return {
      buildings: {
        stats: {
          ...buildingStats,
          newThisMonth: 0, // API mới không có trường này
        },
      },
      areas: {
        stats: {
          ...areaStats,
          newThisMonth: 0, // API mới không có trường này
        },
      },
      totalAll,
      totalActive,
      totalInactive,
      totalUnderMaintenance,
    };
  } catch (error) {
    console.error("[❌ BUILDING-AREA STATS] Lỗi khi lấy thống kê:", error);
    throw error;
  }
};
