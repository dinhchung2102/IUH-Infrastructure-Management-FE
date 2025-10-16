import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface Area {
  _id: string;
  name: string;
  status: string;
  description: string;
  campus: {
    _id: string;
    name: string;
    address: string;
  };
  zoneType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

//Get các khu vực ngoài trời của cơ sở
export const getOutdoorAreasByCampusId = async (campusId: string) => {
  const response = await api.get<ApiResponse<{ areas: Area[] }>>(
    `/zone-area/campus/${campusId}/areas`
  );
  console.log("[API: AREAS]:", response.data);
  return response.data;
};
