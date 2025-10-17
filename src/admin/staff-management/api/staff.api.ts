import api from "@/lib/axios";
import type { QueryStaffDto } from "../types/staff.type";

export const getStaff = async (query: QueryStaffDto) => {
  const response = await api.get("/auth/accounts/staff-only", {
    params: query,
  });
  console.log("[API: STAFF]:", response.data);
  return response.data;
};

export const getStaffById = async (id: string) => {
  const response = await api.get(`/auth/accounts/${id}`);
  return response.data;
};
