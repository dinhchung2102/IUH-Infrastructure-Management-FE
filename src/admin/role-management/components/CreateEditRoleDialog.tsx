import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import type { RoleWithPermissions } from "../types/role.type";
import type {
  PermissionEntity,
  PermissionGroup,
} from "../types/permission.type";
import { Resource } from "@/types/permission.type";
import { createRole, updateRole, getPermissions } from "../api/role.api";

interface CreateEditRoleDialogProps {
  role: RoleWithPermissions | null; // null = create mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Permission labels để hiển thị tiếng Việt
const resourceLabels: Record<string, { label: string; description: string }> = {
  ACCOUNT: { label: "Tài khoản", description: "Quản lý tài khoản người dùng" },
  ROLE: { label: "Vai trò", description: "Quản lý vai trò và phân quyền" },
  PERMISSION: { label: "Quyền hạn", description: "Quản lý quyền hạn hệ thống" },
  REPORT: { label: "Báo cáo", description: "Quản lý báo cáo sự cố" },
  AUDIT: { label: "Bảo trì", description: "Quản lý Nhiệm vụ" },
  ASSET: { label: "Thiết bị", description: "Quản lý thiết bị" },
  CAMPUS: { label: "Cơ sở", description: "Quản lý cơ sở" },
  BUILDING: { label: "Tòa nhà", description: "Quản lý tòa nhà" },
  AREA: { label: "Khu vực", description: "Quản lý khu vực" },
  ZONE: { label: "Phân khu", description: "Quản lý phân khu" },
  ASSET_CATEGORY: {
    label: "Loại thiết bị",
    description: "Quản lý danh mục thiết bị",
  },
  ASSET_TYPE: { label: "Nhóm thiết bị", description: "Quản lý nhóm thiết bị" },
  NEWS: { label: "Tin tức", description: "Quản lý tin tức" },
  NEWS_CATEGORY: {
    label: "Danh mục tin tức",
    description: "Quản lý danh mục tin tức",
  },
};

const actionLabels: Record<string, string> = {
  CREATE: "Tạo mới",
  READ: "Xem",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  ALL: "Tất cả",
  ADMIN_ACTION: "Hành động quản trị",
};

export function CreateEditRoleDialog({
  role,
  open,
  onOpenChange,
  onSuccess,
}: CreateEditRoleDialogProps) {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    []
  );
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>(
    []
  );
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!role;

  const fetchPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const response = await getPermissions();
      if (response.success && response.data) {
        // Group permissions by resource
        groupPermissionsByResource(response.data.permissions);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      toast.error("Không thể tải danh sách quyền");
    } finally {
      setLoadingPermissions(false);
    }
  };

  // Fetch permissions from API when dialog opens
  useEffect(() => {
    if (open) {
      fetchPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const groupPermissionsByResource = (permissions: PermissionEntity[]) => {
    const grouped: Record<string, PermissionEntity[]> = {};

    permissions.forEach((perm) => {
      if (!grouped[perm.resource]) {
        grouped[perm.resource] = [];
      }
      grouped[perm.resource].push(perm);
    });

    const groups: PermissionGroup[] = Object.entries(grouped).map(
      ([resource, perms]) => ({
        resource: resource as Resource,
        label: resourceLabels[resource]?.label || resource,
        description: resourceLabels[resource]?.description || "",
        permissions: perms,
      })
    );

    setPermissionGroups(groups);
  };

  useEffect(() => {
    if (role && open) {
      setRoleName(role.roleName);
      setDescription(role.description || "");
      // If editing, try to get permission IDs from role
      // Note: role.permissions might be RolePermission[] or string[]
      setSelectedPermissionIds([]);
    } else if (!open) {
      // Reset form when closed
      setRoleName("");
      setDescription("");
      setSelectedPermissionIds([]);
    }
  }, [role, open]);

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    setSelectedPermissionIds((prev) => {
      if (checked) {
        return [...prev, permissionId];
      } else {
        return prev.filter((id) => id !== permissionId);
      }
    });
  };

  const isPermissionSelected = (permissionId: string): boolean => {
    return selectedPermissionIds.includes(permissionId);
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error("Vui lòng nhập tên vai trò");
      return;
    }

    if (selectedPermissionIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 quyền");
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateRole(role._id, {
          roleName: roleName.trim(),
          isActive: true,
          permissions: selectedPermissionIds,
        });
        toast.success("Cập nhật vai trò thành công!");
      } else {
        await createRole({
          roleName: roleName.trim(),
          isActive: true,
          permissions: selectedPermissionIds,
        });
        toast.success("Tạo vai trò mới thành công!");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error(
        isEditMode ? "Không thể cập nhật vai trò" : "Không thể tạo vai trò"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Save className="h-5 w-5" />
                Chỉnh sửa vai trò
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Tạo vai trò mới
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin và quyền hạn của vai trò"
              : "Tạo vai trò mới và cấu hình quyền hạn"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">
                  Tên vai trò <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="roleName"
                  placeholder="VD: MODERATOR, TECHNICIAN..."
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value.toUpperCase())}
                  className="bg-white uppercase"
                  // Tạm thời cho phép edit tất cả để debug
                  // disabled={isEditMode && !!role?.isSystem}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả vai trò này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white"
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Permissions */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-base mb-1">
                  Cấu hình quyền hạn
                </h3>
                <p className="text-sm text-muted-foreground">
                  Chọn các quyền mà vai trò này được phép thực hiện
                  {selectedPermissionIds.length > 0 && (
                    <span className="text-primary font-medium ml-2">
                      ({selectedPermissionIds.length} quyền đã chọn)
                    </span>
                  )}
                </p>
              </div>

              {loadingPermissions ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Đang tải quyền hạn...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {permissionGroups.map((group) => (
                    <div
                      key={group.resource}
                      className="border rounded-lg p-4 bg-muted/30"
                    >
                      <div className="mb-3">
                        <h4 className="font-medium text-sm">{group.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          {group.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {group.permissions.map((perm) => (
                          <div
                            key={perm._id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={perm._id}
                              checked={isPermissionSelected(perm._id)}
                              onCheckedChange={(checked) =>
                                handlePermissionToggle(
                                  perm._id,
                                  checked as boolean
                                )
                              }
                            />
                            <label
                              htmlFor={perm._id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {actionLabels[perm.action] || perm.action}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {isEditMode ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              <>
                {isEditMode ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Cập nhật
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo mới
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
