import api from "@/lib/axios";

export const getReportTypes = async () => {
  const response = await api.get("/report/types/list");
  console.log("[API: REPORT TYPES]:", response.data);
  return response.data;
};
