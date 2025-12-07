import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type {
  Maintenance,
  CreateMaintenanceDto,
  UpdateMaintenanceDto,
  QueryMaintenanceDto,
  MaintenanceListResponse,
} from "../types/maintenance.type";

/**
 * Tạo lịch bảo trì mới
 */
export const createMaintenance = async (
  data: CreateMaintenanceDto
): Promise<ApiResponse<Maintenance>> => {
  const formData = new FormData();

  // Required fields
  formData.append("asset", data.asset);
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("scheduledDate", data.scheduledDate);

  // Optional fields
  if (data.status) {
    formData.append("status", data.status);
  }
  if (data.priority) {
    formData.append("priority", data.priority);
  }
  if (data.notes) {
    formData.append("notes", data.notes);
  }

  // Assigned staff (array)
  if (data.assignedTo && data.assignedTo.length > 0) {
    data.assignedTo.forEach((staffId) => {
      formData.append("assignedTo[]", staffId);
    });
  }

  // Images (files)
  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  const response = await api.post<ApiResponse<Maintenance>>(
    "/maintenance",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("[API: CREATE MAINTENANCE]:", response.data);
  return response.data;
};

/**
 * Lấy danh sách lịch bảo trì
 */
export const getMaintenances = async (
  query?: QueryMaintenanceDto
): Promise<ApiResponse<MaintenanceListResponse>> => {
  const response = await api.get<ApiResponse<MaintenanceListResponse>>(
    "/maintenance",
    { params: query }
  );
  console.log("[API: GET MAINTENANCES]:", response.data);
  return response.data;
};

/**
 * Lấy chi tiết lịch bảo trì
 */
export const getMaintenanceById = async (
  id: string
): Promise<ApiResponse<Maintenance>> => {
  const response = await api.get<ApiResponse<Maintenance>>(
    `/maintenance/${id}`
  );
  console.log("[API: GET MAINTENANCE BY ID]:", response.data);
  return response.data;
};

/**
 * Cập nhật lịch bảo trì
 */
export const updateMaintenance = async (
  id: string,
  data: UpdateMaintenanceDto
): Promise<ApiResponse<Maintenance>> => {
  const formData = new FormData();

  // Optional fields
  if (data.asset) {
    formData.append("asset", data.asset);
  }
  if (data.title) {
    formData.append("title", data.title);
  }
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.status) {
    formData.append("status", data.status);
  }
  if (data.priority) {
    formData.append("priority", data.priority);
  }
  if (data.scheduledDate) {
    formData.append("scheduledDate", data.scheduledDate);
  }
  if (data.completedDate) {
    formData.append("completedDate", data.completedDate);
  }
  if (data.notes !== undefined) {
    formData.append("notes", data.notes);
  }

  // Assigned staff (array)
  if (data.assignedTo && data.assignedTo.length > 0) {
    data.assignedTo.forEach((staffId) => {
      formData.append("assignedTo[]", staffId);
    });
  }

  // Images (files)
  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  const response = await api.patch<ApiResponse<Maintenance>>(
    `/maintenance/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("[API: UPDATE MAINTENANCE]:", response.data);
  return response.data;
};

/**
 * Xóa lịch bảo trì
 */
export const deleteMaintenance = async (
  id: string
): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`/maintenance/${id}`);
  console.log("[API: DELETE MAINTENANCE]:", response.data);
  return response.data;
};

/**
 * Lấy danh sách lịch bảo trì quá hạn
 */
export const getOverdueMaintenances = async (): Promise<
  ApiResponse<Maintenance[]>
> => {
  const response = await api.get<ApiResponse<Maintenance[]>>(
    "/maintenance/overdue"
  );
  console.log("[API: GET OVERDUE MAINTENANCES]:", response.data);
  return response.data;
};

/**
 * Lấy danh sách lịch bảo trì sắp tới
 */
export const getUpcomingMaintenances = async (
  days?: number
): Promise<ApiResponse<Maintenance[]>> => {
  const response = await api.get<ApiResponse<Maintenance[]>>(
    "/maintenance/upcoming",
    { params: days ? { days: days.toString() } : undefined }
  );
  console.log("[API: GET UPCOMING MAINTENANCES]:", response.data);
  return response.data;
};
