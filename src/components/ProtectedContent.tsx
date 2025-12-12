import { type ReactNode } from "react";
import { usePermission } from "@/hooks/use-permission";
import type { Resource, Permission } from "@/types/permission.type";

interface ProtectedContentProps {
  resource: Resource;
  action?: Permission;
  actions?: Permission[]; // Check if user has ANY of these actions
  requireAll?: boolean; // If true, require ALL actions instead of ANY
  fallback?: ReactNode; // Content to show when permission denied
  children: ReactNode;
}

/**
 * Component to conditionally render content based on user permissions
 *
 * @example
 * // Show button only if user can create accounts
 * <ProtectedContent resource="ACCOUNT" action="CREATE">
 *   <Button>Create Account</Button>
 * </ProtectedContent>
 *
 * // Show menu if user has any of these permissions
 * <ProtectedContent resource="REPORT" actions={["CREATE", "UPDATE"]}>
 *   <Menu>...</Menu>
 * </ProtectedContent>
 *
 * // Show form only if user has ALL permissions
 * <ProtectedContent resource="ACCOUNT" actions={["CREATE", "UPDATE"]} requireAll>
 *   <Form>...</Form>
 * </ProtectedContent>
 */
export function ProtectedContent({
  resource,
  action,
  actions,
  requireAll = false,
  fallback = null,
  children,
}: ProtectedContentProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    usePermission();

  let hasAccess = false;

  if (action) {
    // Single action check
    hasAccess = hasPermission(resource, action);
  } else if (actions && actions.length > 0) {
    // Multiple actions check
    if (requireAll) {
      hasAccess = hasAllPermissions(resource, actions);
    } else {
      hasAccess = hasAnyPermission(resource, actions);
    }
  } else {
    // No specific action - check if user has any permission for this resource
    hasAccess = hasPermission(resource, "READ");
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
