import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface Asset {
  _id: string;
  name: string;
  code: string;
  status: string;
  description: string;
  assetType: {
    _id: string;
    name: string;
  };
  assetCategory: {
    _id: string;
    name: string;
  };
  image?: string;
  zone?: string;
  area?: string | null;
  properties: Record<string, any>;
}

export interface AssetResponse {
  _id: string;
  name: string;
  code: string;
  status: string;
  description: string;
  assetType: {
    _id: string;
    name: string;
  };
  assetCategory: {
    _id: string;
    name: string;
  };
  zone: {
    _id: string;
    name: string;
    building: {
      _id: string;
      name: string;
      floor: number;
      campus: {
        _id: string;
        name: string;
      };
    };
    area: null;
    properties: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    __v: number;
    image: string;
  };
}

//Get các vật tư của khu vực nội bộ trong tòa nhà
export const getAssetsByZoneId = async (zoneId: string) => {
  const response = await api.get<ApiResponse<{ assets: Asset[] }>>(
    `/assets/zones/${zoneId}/assets`
  );
  console.log("[API: ASSETS]:", response.data);
  return response.data;
};

//Get các vật tư của khu vực ngoài trời trong cơ sở
export const getAssetsByAreaId = async (areaId: string) => {
  const response = await api.get<ApiResponse<{ assets: Asset[] }>>(
    `/assets/areas/${areaId}/assets`
  );
  console.log("[API: ASSETS]:", response.data);
  return response.data;
};

export const getAssetById = async (assetId: string) => {
  const response = await api.get<ApiResponse<{ asset: AssetResponse }>>(
    `/assets/${assetId}`
  );
  console.log("[API: ASSET]:", response.data);
  return response.data;
};
