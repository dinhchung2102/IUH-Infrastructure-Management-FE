import { useAuth } from "../providers/AuthContext";

// Hook kiểm tra quyền truy cập
export default function usePermission() {
  const { user } = useAuth();

  const hasRole = (roles) => {
    if (!user?.role) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
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
