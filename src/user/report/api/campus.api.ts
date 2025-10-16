import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface Campus {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  manager: {
    _id: string;
    email: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getCampuses = async () => {
  const response = await api.get<ApiResponse<{ campuses: Campus[] }>>(
    "/campus"
  );
  console.log("[API: CAMPUSES]:", response.data);
  return response.data;
};
