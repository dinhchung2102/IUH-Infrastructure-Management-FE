import { useState, useEffect } from "react";
import {
  RoleStatsCards,
  RoleTable,
  RoleDetailDialog,
  CreateEditRoleDialog,
  AssignRoleDialog,
  PermissionDebugDialog,
} from "../components";
import type { Role, RoleWithPermissions } from "../types/role.type";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, UserCog, Code } from "lucide-react";
import { getRoles, deleteRole, getRoleStats } from "../api/role.api";
import { isSystemRole } from "../utils/role.utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const mockStats = {
  totalRoles: 0,
  systemRoles: 0,
  customRoles: 0,
  totalUsers: 0,
};

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<RoleWithPermissions | null>(
    null
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createEditDialogOpen, setCreateEditDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);
  const [stats, setStats] = useState(mockStats);
  const [loading, setLoading] = useState(false);

  // Debug mode
  const [debugMode, setDebugMode] = useState(false);
  const [permissionDebugOpen, setPermissionDebugOpen] = useState(false);

  // Enable debug mode with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        setDebugMode((prev) => !prev);
        toast.success(debugMode ? "Debug mode OFF" : "Debug mode ON 🛠️");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [debugMode]);

  // Fetch roles từ API (nếu có)
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      if (response.success && response.data) {
        setRoles(response.data.roles);
        // Update stats based on fetched data
        const sysCount = response.data.roles.filter((r) =>
          isSystemRole(r.roleName)
        ).length;
        setStats((prev) => ({
          ...prev,
          totalRoles: response.data!.total,
          systemRoles: sysCount,
          customRoles: response.data!.total - sysCount,
        }));
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Không thể tải danh sách vai trò");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats từ API (nếu có)
  const fetchStats = async () => {
    try {
      const response = await getRoleStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats(mockStats);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchStats();
  }, []);

  const handleViewDetails = (role: Role) => {
    setSelectedRole(role);
    setDetailDialogOpen(true);
  };

  const handleEdit = (role: Role) => {
    // Prevent editing system roles
    if (isSystemRole(role.roleName)) {
      toast.error("Không thể chỉnh sửa vai trò hệ thống mặc định");
      return;
    }

    // Convert Role to RoleWithPermissions for editing
    const editRole: RoleWithPermissions = {
      ...role,
      permissions: role.permissions as unknown as [], // Use current permissions
      isSystem: false,
    };
    setEditingRole(editRole);
    setCreateEditDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditingRole(null);
    setCreateEditDialogOpen(true);
  };

  const handleDelete = (roleId: string) => {
    // Find the role to check if it's a system role
    const role = roles.find((r) => r._id === roleId);
    if (role && isSystemRole(role.roleName)) {
      toast.error("Không thể xóa vai trò hệ thống mặc định");
      return;
    }

    setRoleToDelete(roleId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRole(roleToDelete);
      toast.success("Xóa vai trò thành công!");
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Không thể xóa vai trò");
    } finally {
      setDeleteConfirmOpen(false);
      setRoleToDelete(null);
    }
  };

  const handleSuccess = () => {
    fetchRoles();
    fetchStats();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/roles" },
            { label: "Phân quyền", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-4 md:mt-0">
          {debugMode && (
            <Button
              onClick={() => setPermissionDebugOpen(true)}
              variant="destructive"
              className="cursor-pointer"
            >
              <Code className="h-4 w-4" />
              Debug Permissions
            </Button>
          )}
          <Button
            onClick={() => setAssignDialogOpen(true)}
            variant="outline"
            className="cursor-pointer"
          >
            <UserCog className="h-4 w-4" />
            Gán vai trò
          </Button>
          <Button onClick={handleCreateNew} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Tạo vai trò mới
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <RoleStatsCards stats={stats} />

      {/* Table */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-md border bg-white p-12 text-center">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <RoleTable
            roles={roles}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Detail Dialog */}
      <RoleDetailDialog
        role={selectedRole}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />

      {/* Create/Edit Dialog */}
      <CreateEditRoleDialog
        role={editingRole}
        open={createEditDialogOpen}
        onOpenChange={setCreateEditDialogOpen}
        onSuccess={handleSuccess}
      />

      {/* Assign Role Dialog */}
      <AssignRoleDialog
        roles={roles}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onSuccess={handleSuccess}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa vai trò</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vai trò này? Hành động này không thể
              hoàn tác. Tất cả người dùng có vai trò này sẽ mất quyền hạn tương
              ứng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permission Debug Dialog */}
      <PermissionDebugDialog
        open={permissionDebugOpen}
        onOpenChange={setPermissionDebugOpen}
      />
    </div>
  );
}
