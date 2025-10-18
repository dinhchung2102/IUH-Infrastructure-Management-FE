import type { RoleName } from "@/types/role.enum";
import type { Resource, Permission } from "@/types/permission.type";

export interface Role {
  _id: string;
  roleName: RoleName;
  description?: string;
  permissions: string[]; // Array of permission IDs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Role with populated permissions (for display)
export interface RoleWithPermissions extends Omit<Role, "permissions"> {
  permissions: RolePermission[];
  isSystem?: boolean; // Helper field
}

export interface RolePermission {
  resource: Resource;
  actions: Permission[];
}

export interface CreateRoleDto {
  roleName: string;
  isActive: boolean;
  permissions: string[]; // Array of permission IDs
}

export interface UpdateRoleDto {
  roleName?: string;
  isActive?: boolean;
  permissions?: string[]; // Array of permission IDs
}

export interface AssignRoleDto {
  accountId: string;
  roleId: string;
}

export interface RoleStats {
  totalRoles: number;
  systemRoles: number;
  customRoles: number;
  totalUsers: number;
}

// Helper type for permission display
export interface PermissionDisplay {
  resource: Resource;
  label: string;
  description: string;
  actions: {
    action: Permission;
    label: string;
    enabled: boolean;
  }[];
}
