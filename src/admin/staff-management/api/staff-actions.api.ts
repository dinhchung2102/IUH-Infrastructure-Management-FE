import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { StaffResponse, CreateStaffDto } from "../types/staff.type";

// Create staff
export const createStaff = async (
  data: CreateStaffDto | FormData
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.post(`/auth/accounts/staff-only`, data, {
    headers:
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : undefined,
  });
  return response.data;
};

// Get staff by ID
export const getStaffById = async (
  id: string
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.get(`/auth/accounts/${id}`);
  return response.data;
};

// Lock staff account
export const lockStaff = async (
  id: string
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.patch(`/auth/accounts/${id}/lock`);
  return response.data;
};

// Unlock staff account
export const unlockStaff = async (
  id: string
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.patch(`/auth/accounts/${id}/unlock`);
  return response.data;
};

// Delete staff account
export const deleteStaff = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/auth/accounts/${id}`);
  return response.data;
};
