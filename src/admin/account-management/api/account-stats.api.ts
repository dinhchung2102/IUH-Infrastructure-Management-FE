import api from "@/lib/axios";

export const getAccountStats = async () => {
  const response = await api.get("/auth/accounts/stats");
  return response.data;
};
