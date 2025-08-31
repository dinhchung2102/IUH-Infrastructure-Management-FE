import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthContext";
import usePermission from "../../../hooks/usePermission";

export default function PermissionGuard({ roles, children }) {
  const { user } = useAuth();
  const { hasRole } = usePermission();

  // ⏳ Đang chưa load user thì chưa quyết định
  if (user === null) {
    return null; // hoặc spinner
  }

  // ❌ Không đúng quyền
  if (!hasRole(roles)) {
    return <Navigate to="/error" replace />;
  }

  return <>{children}</>;
}
