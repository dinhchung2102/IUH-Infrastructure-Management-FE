import api from "@/lib/axios";
import type { ApiResponse } from "@/types/response.type";
import type {
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  AssignRoleDto,
  RoleStats,
} from "../types/role.type";
import type { PermissionEntity } from "../types/permission.type";

// Lấy danh sách roles
export const getRoles = async () => {
  const response = await api.get<ApiResponse<{ roles: Role[]; total: number }>>(
    "/auth/roles"
  );
  console.log("[API: GET ROLES]:", response.data);
  return response.data;
};

// Lấy role theo ID
export const getRoleById = async (roleId: string) => {
  const response = await api.get<ApiResponse<Role>>(`/roles/${roleId}`);
  console.log("[API: GET ROLE BY ID]:", response.data);
  return response.data;
};

// Lấy danh sách permissions
export const getPermissions = async () => {
  const response = await api.get<
    ApiResponse<{ permissions: PermissionEntity[]; total: number }>
  >("/auth/permissions");
  console.log("[API: GET PERMISSIONS]:", response.data);
  return response.data;
};

// Tạo role mới
export const createRole = async (data: CreateRoleDto) => {
  const response = await api.post<ApiResponse<Role>>("/auth/create-role", data);
  console.log("[API: CREATE ROLE]:", response.data);
  return response.data;
};

// Cập nhật role
export const updateRole = async (roleId: string, data: UpdateRoleDto) => {
  const response = await api.patch<ApiResponse<Role>>(
    `/auth/roles/${roleId}`,
    data
  );
  console.log("[API: UPDATE ROLE]:", response.data);
  return response.data;
};

// Xóa role
export const deleteRole = async (roleId: string) => {
  const response = await api.delete<ApiResponse>(`/auth/roles/${roleId}`);
  console.log("[API: DELETE ROLE]:", response.data);
  return response.data;
};

// Gán role cho account
export const assignRole = async (data: AssignRoleDto) => {
  const response = await api.post<ApiResponse>("/roles/assign", data);
  console.log("[API: ASSIGN ROLE]:", response.data);
  return response.data;
};

// Lấy thống kê roles
export const getRoleStats = async () => {
  const response = await api.get<ApiResponse<RoleStats>>("/roles/stats");
  console.log("[API: GET ROLE STATS]:", response.data);
  return response.data;
};

// ========== PERMISSION CRUD (Debug/Dev) ==========

// Tạo permission mới
export const createPermission = async (data: {
  resource: string;
  action: string;
}) => {
  const response = await api.post<ApiResponse<PermissionEntity>>(
    "/auth/create-permission",
    data
  );
  console.log("[API: CREATE PERMISSION]:", response.data);
  return response.data;
};

// Cập nhật permission
export const updatePermission = async (
  permissionId: string,
  data: {
    resource?: string;
    action?: string;
  }
) => {
  const response = await api.patch<ApiResponse<PermissionEntity>>(
    `/auth/permissions/${permissionId}`,
    data
  );
  console.log("[API: UPDATE PERMISSION]:", response.data);
  return response.data;
};

// Xóa permission
export const deletePermission = async (permissionId: string) => {
  const response = await api.delete<ApiResponse>(
    `/auth/permissions/${permissionId}`
  );
  console.log("[API: DELETE PERMISSION]:", response.data);
  return response.data;
};
