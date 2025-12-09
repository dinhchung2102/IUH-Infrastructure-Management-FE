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
// Response structure: { success: true, data: { account: StaffResponse } }
export const getStaffById = async (
  id: string
): Promise<ApiResponse<{ account: StaffResponse } | StaffResponse>> => {
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

// ==================== Location Assignment APIs ====================

// Assign campus to account
export const assignCampusToAccount = async (
  accountId: string,
  campusId: string
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.post(`/auth/accounts/assign-campus`, {
    accountId,
    campusId,
  });
  return response.data;
};

// Assign buildings to account
export const assignBuildingsToAccount = async (
  accountId: string,
  locationIds: string[]
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.post(`/auth/accounts/assign-buildings`, {
    accountId,
    locationIds,
  });
  return response.data;
};

// Assign zones to account
export const assignZonesToAccount = async (
  accountId: string,
  locationIds: string[]
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.post(`/auth/accounts/assign-zones`, {
    accountId,
    locationIds,
  });
  return response.data;
};

// Assign areas to account
export const assignAreasToAccount = async (
  accountId: string,
  locationIds: string[]
): Promise<ApiResponse<StaffResponse>> => {
  const response = await api.post(`/auth/accounts/assign-areas`, {
    accountId,
    locationIds,
  });
  return response.data;
};

// Remove campus from account
export const removeCampusFromAccount = async (
  accountId: string
): Promise<ApiResponse<void>> => {
  const response = await api.delete(
    `/auth/accounts/${accountId}/remove-campus`
  );
  return response.data;
};

// Remove building from account
export const removeBuildingFromAccount = async (
  accountId: string,
  locationId: string
): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/auth/accounts/remove-building`, {
    data: { accountId, locationId },
  });
  return response.data;
};

// Remove zone from account
export const removeZoneFromAccount = async (
  accountId: string,
  locationId: string
): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/auth/accounts/remove-zone`, {
    data: { accountId, locationId },
  });
  return response.data;
};

// Remove area from account
export const removeAreaFromAccount = async (
  accountId: string,
  locationId: string
): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/auth/accounts/remove-area`, {
    data: { accountId, locationId },
  });
  return response.data;
};
