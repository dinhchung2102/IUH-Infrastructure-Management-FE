import type { Resource, Permission } from "@/types/permission.type";

export interface PermissionEntity {
  _id: string;
  resource: Resource;
  action: Permission;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionGroup {
  resource: Resource;
  label: string;
  description: string;
  permissions: PermissionEntity[];
}
