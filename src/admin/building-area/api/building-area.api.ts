import { getBuildings } from "@/admin/building-area/api/building.api";
import { getAreas } from "@/admin/building-area/api/area.api";

import type { BuildingResponse } from "@/admin/building-area/api/building.api";
import type { AreaResponse } from "@/admin/building-area/api/area.api";

export type BuildingAreaItem = (BuildingResponse | AreaResponse) & {
  type: "BUILDING" | "AREA";
};

/** 🔹 API gộp dữ liệu Tòa nhà + Khu vực */
export const getBuildingAreaList = async () => {
  try {
    // Gọi song song 2 API
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

    // Gộp & sắp xếp theo createdAt mới nhất
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
