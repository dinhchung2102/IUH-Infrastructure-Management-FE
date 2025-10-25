import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export const uploadAssetImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post<ApiResponse<{ url: string }>>(
    "/uploads",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};
