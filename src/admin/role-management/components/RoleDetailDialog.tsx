import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Shield, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import type { Role } from "../types/role.type";
import type { PermissionEntity } from "../types/permission.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getPermissions } from "../api/role.api";

interface RoleDetailDialogProps {
  role: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const resourceLabels: Record<string, string> = {
  ACCOUNT: "Tài khoản",
  ROLE: "Vai trò",
  PERMISSION: "Quyền hạn",
  REPORT: "Báo cáo",
  AUDIT: "Bảo trì",
  ASSET: "Thiết bị",
  CAMPUS: "Cơ sở",
  BUILDING: "Tòa nhà",
  AREA: "Khu vực",
  ZONE: "Phân khu",
  ASSET_CATEGORY: "Loại thiết bị",
  ASSET_TYPE: "Nhóm thiết bị",
  NEWS: "Tin tức",
  NEWS_CATEGORY: "Danh mục tin tức",
};

const actionLabels: Record<string, string> = {
  CREATE: "Tạo mới",
  READ: "Xem",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  ALL: "Tất cả",
  ADMIN_ACTION: "Hành động quản trị",
};

export function RoleDetailDialog({
  role,
  open,
  onOpenChange,
}: RoleDetailDialogProps) {
  const [permissions, setPermissions] = useState<PermissionEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role && open) {
      fetchRolePermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, open]);

  const fetchRolePermissions = async () => {
    if (!role) return;

    try {
      setLoading(true);
      const response = await getPermissions();
      if (response.success && response.data) {
        // Filter permissions that belong to this role
        const rolePermissions = response.data.permissions.filter((perm) =>
          role.permissions.includes(perm._id)
        );
        setPermissions(rolePermissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) {
      acc[perm.resource] = [];
    }
    acc[perm.resource].push(perm);
    return acc;
  }, {} as Record<string, PermissionEntity[]>);

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Chi tiết vai trò
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết và quyền hạn của vai trò
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Role Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-base px-4 py-1">
                  {role.roleName}
                </Badge>
                {/* Tạm thời ẩn system role badge vì đang debug */}
                {/* {role.isSystem && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Vai trò hệ thống
                  </Badge>
                )} */}
              </div>
              {role.description && (
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              )}
            </div>

            <Separator />

            {/* Permissions Summary */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Tổng quan quyền hạn
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Tổng quyền
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {role.permissions.length}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">
                    Trạng thái
                  </p>
                  <p className="text-sm font-bold text-purple-600">
                    {role.isActive ? "Hoạt động" : "Ngưng"}
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Ngày tạo</p>
                  <p className="text-sm font-bold text-green-600">
                    {format(new Date(role.createdAt), "dd/MM/yyyy")}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Permissions List */}
            <div>
              <h3 className="text-sm font-semibold mb-3">
                Danh sách quyền hạn
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Đang tải chi tiết quyền...
                    </p>
                  </div>
                ) : role.permissions.length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Vai trò này chưa có quyền nào
                    </p>
                  </div>
                ) : permissions.length === 0 ? (
                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm font-medium mb-3">
                      Tổng cộng: {role.permissions.length} quyền
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {role.permissions.map((permId, index) => (
                        <Badge
                          key={permId}
                          variant="secondary"
                          className="justify-center"
                        >
                          Quyền #{index + 1}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  Object.entries(groupedPermissions).map(
                    ([resource, perms]) => (
                      <div
                        key={resource}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-sm">
                              {resourceLabels[resource] || resource}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {perms.length} quyền
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {perms.map((perm) => (
                            <Badge
                              key={perm._id}
                              variant="secondary"
                              className="gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              {actionLabels[perm.action] || perm.action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            <Separator />

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Ngày tạo
                  </span>
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(role.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Cập nhật
                  </span>
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(role.updatedAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
