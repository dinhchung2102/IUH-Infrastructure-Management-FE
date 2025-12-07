import { useState, useEffect } from "react";
import { getRoles } from "@/admin/role-management/api/role.api";
import type { Role } from "@/admin/role-management/types/role.type";
import { toast } from "sonner";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRoles();
      if (response.success && response.data) {
        // Filter only active roles
        const activeRoles = response.data.roles.filter((role) => role.isActive);
        setRoles(activeRoles);
      } else {
        setError(response.message || "Không thể tải danh sách vai trò");
        toast.error(response.message || "Không thể tải danh sách vai trò");
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
      const errorMessage = "Lỗi khi tải danh sách vai trò";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
  };
}
