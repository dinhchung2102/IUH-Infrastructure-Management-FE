import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Lock } from "lucide-react";
import { TableActionMenu } from "@/components/TableActionMenu";
import type { Role } from "../types/role.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface RoleTableProps {
  roles: Role[];
  onViewDetails: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
}

const getRoleNameBadge = (roleName: string, isActive: boolean) => {
  // System roles (không thể xóa)
  const systemRoles = [
    "ADMIN",
    "STAFF",
    "CAMPUS_ADMIN",
    "GUEST",
    "STUDENT",
    "LECTURER",
  ];
  const isSystem = systemRoles.includes(roleName);

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isSystem ? "default" : "outline"}
        className={isSystem ? "bg-purple-600" : ""}
      >
        {roleName}
      </Badge>
      {isSystem && <Lock className="h-3 w-3 text-muted-foreground" />}
      {!isActive && (
        <Badge
          variant="outline"
          className="text-xs text-red-600 border-red-200"
        >
          Ngưng hoạt động
        </Badge>
      )}
    </div>
  );
};

export function RoleTable({
  roles,
  onViewDetails,
  onEdit,
  onDelete,
}: RoleTableProps) {
  if (roles.length === 0) {
    return (
      <div className="rounded-md border bg-white">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy vai trò nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] text-center">STT</TableHead>
            <TableHead>Tên vai trò</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Số quyền</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role, index) => (
            <TableRow key={role._id}>
              <TableCell className="text-center font-medium">
                {index + 1}
              </TableCell>
              <TableCell>
                {getRoleNameBadge(role.roleName, role.isActive)}
              </TableCell>
              <TableCell>
                <p className="text-sm text-muted-foreground max-w-[300px] truncate">
                  {role.description || "Không có mô tả"}
                </p>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {role.permissions.length} quyền
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">
                    {format(new Date(role.createdAt), "dd/MM/yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(role.createdAt), "HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <TableActionMenu
                  showLabel
                  actions={[
                    {
                      label: "Xem chi tiết",
                      icon: Eye,
                      onClick: () => onViewDetails(role),
                    },
                    {
                      label: "Chỉnh sửa",
                      icon: Edit,
                      onClick: () => onEdit(role),
                    },
                    {
                      label: "Xóa",
                      icon: Trash2,
                      onClick: () => onDelete(role._id),
                      variant: "destructive",
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
