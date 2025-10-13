import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type { AccountResponse } from "../types/account.type";

// Get account by ID
export const getAccountById = async (
  id: string
): Promise<ApiResponse<AccountResponse>> => {
  const response = await api.get(`/auth/accounts/${id}`);
  return response.data;
};

// Lock account
export const lockAccount = async (
  id: string
): Promise<ApiResponse<AccountResponse>> => {
  const response = await api.patch(`/auth/accounts/${id}/lock`);
  return response.data;
};

// Unlock account
export const unlockAccount = async (
  id: string
): Promise<ApiResponse<AccountResponse>> => {
  const response = await api.patch(`/auth/accounts/${id}/unlock`);
  return response.data;
};

// Delete account
export const deleteAccount = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete(`/auth/accounts/${id}`);
  return response.data;
};
