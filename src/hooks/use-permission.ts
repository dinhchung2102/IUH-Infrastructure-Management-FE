import { useMemo, useCallback } from "react";
import { useAuth } from "./use-auth";
import type { Resource, Permission, PermissionString } from "@/types/permission.type";

/**
 * Hook to check user permissions
 * 
 * @example
 * const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
 * 
 * // Check single permission
 * if (hasPermission("ACCOUNT", "CREATE")) { ... }
 * 
 * // Check any of multiple permissions
 * if (hasAnyPermission("ACCOUNT", ["CREATE", "UPDATE"])) { ... }
 * 
 * // Check all permissions
 * if (hasAllPermissions("ACCOUNT", ["CREATE", "UPDATE"])) { ... }
 */
export function usePermission() {
  const { permissions } = useAuth();

  const hasPermission = useCallback(
    (resource: Resource, action: Permission): boolean => {
      if (!permissions || permissions.length === 0) return false;

      // Check for exact permission
      const permissionString: PermissionString = `${resource}:${action}`;
      if (permissions.includes(permissionString)) {
        return true;
      }

      // Check for ALL permission (wildcard)
      const allPermission: PermissionString = `${resource}:ALL`;
      if (permissions.includes(allPermission)) {
        return true;
      }

      // Check for ADMIN_ACTION permission (super admin)
      const adminPermission = permissions.some((p) => p.includes(":ADMIN_ACTION"));
      if (adminPermission) {
        return true;
      }

      return false;
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (resource: Resource, actions: Permission[]): boolean => {
      return actions.some((action) => hasPermission(resource, action));
    },
    [hasPermission]
  );

  const hasAllPermissions = useCallback(
    (resource: Resource, actions: Permission[]): boolean => {
      return actions.every((action) => hasPermission(resource, action));
    },
    [hasPermission]
  );

  const hasResourcePermission = useCallback(
    (resource: Resource): boolean => {
      if (!permissions || permissions.length === 0) return false;

      // Check if user has any permission for this resource
      return permissions.some((p) => {
        const [res] = p.split(":");
        return res === resource;
      });
    },
    [permissions]
  );

  const isAdmin = useMemo(() => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.some((p) => p.includes(":ADMIN_ACTION"));
  }, [permissions]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasResourcePermission,
    isAdmin,
    permissions,
  };
}
