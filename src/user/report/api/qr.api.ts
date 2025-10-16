import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";

export interface QRCodeData {
  qr: string; // base64 image data
  url: string; // quick report URL
}

export const generateQRCode = async (assetId: string) => {
  const response = await api.get<ApiResponse<QRCodeData>>(`/qr/${assetId}`);
  console.log("[API: QR CODE]:", response.data);
  return response.data;
};
