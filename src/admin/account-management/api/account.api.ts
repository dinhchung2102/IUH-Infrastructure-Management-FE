import api from "@/lib/axios";
import type { QueryAccountsDto } from "../types/account.type";

export const getAccounts = async (query: QueryAccountsDto) => {
  const response = await api.get("/auth/accounts", { params: query });
  console.log("[API: ACCOUNT]:", response.data);
  return response.data;
};

export const getAccountById = async (id: string) => {
  const response = await api.get(`/accounts/${id}`);
  return response.data;
};
