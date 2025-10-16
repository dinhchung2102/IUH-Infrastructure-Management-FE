import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface Building {
  _id: string;
  name: string;
  floor: number;
  status: string;
  campus: {
    _id: string;
    name: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

//Get các tòa nhà của cơ sở
export const getBuildingsByCampusId = async (campusId: string) => {
  const response = await api.get<ApiResponse<{ buildings: Building[] }>>(
    `/zone-area/campus/${campusId}/buildings`
  );
  console.log("[API: BUILDINGS]:", response.data);
  return response.data;
};

export interface ZoneArea {
  _id: string;
  name: string;
  description: string;
  status: string;
  building: {
    _id: string;
    name: string;
    floor: number;
    campus: {
      _id: string;
      name: string;
      address: string;
    };
  };
  zoneType: string;
  floorLocation: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

//Get các khu vực nội bộ của tòa nhà
export const getZoneAreasByBuildingId = async (buildingId: string) => {
  const response = await api.get<ApiResponse<{ zones: ZoneArea[] }>>(
    `/zone-area/buildings/${buildingId}/zones`
  );
  console.log("[API: ZONE AREAS]:", response.data);
  return response.data;
};

export const getZonesByBuildingFloor = async (
  buildingId: string,
  floor: number
) => {
  const response = await api.get<ApiResponse<{ zones: ZoneArea[] }>>(
    `/zone-area/buildings/${buildingId}/zones/floor/${floor}`
  );
  console.log("[API: ZONES BY BUILDING FLOOR]:", response.data);
  return response.data;
};
