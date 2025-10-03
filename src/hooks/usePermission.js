import { useAuth } from "../providers/AuthContext";

// Hook kiểm tra quyền truy cập
export default function usePermission() {
  const { user } = useAuth();

  const hasRole = (roles) => {
    if (!user?.role) return false;

    // Get role value - handle both string and object cases
    const userRole =
      typeof user.role === "object" ? user.role?.roleName : user.role;

    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return userRole === roles;
  };

  const hasPermission = (permissions) => {
    if (!user?.permissions) return false;
    if (Array.isArray(permissions)) {
      return permissions.some((p) => user.permissions.includes(p));
    }
    return user.permissions.includes(permissions);
  };

  return { hasRole, hasPermission };
}
