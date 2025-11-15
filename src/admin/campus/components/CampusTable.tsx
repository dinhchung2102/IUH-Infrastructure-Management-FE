import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { getActiveStatusBadge } from "@/config/badge.config";
import { TableSkeleton } from "@/components/TableSkeleton";

interface Campus {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  status: string;
  manager?: {
    fullName: string;
    email: string;
  };
  region?: string;
}

interface CampusTableProps {
  campuses: Campus[];
  loading: boolean;
  onEdit: (campus: Campus) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (campus: Campus) => void;
}

export function CampusTable({
  campuses,
  loading,
  onEdit,
  onDelete,
  onToggleStatus,
}: CampusTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-12">STT</TableHead>
            <TableHead>Tên cơ sở</TableHead>
            <TableHead>Địa chỉ</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Người quản lý</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center w-24">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && (
            <TableSkeleton
              rows={5}
              columns={[
                { type: "number" },
                { type: "text" },
                { type: "text" },
                { type: "text" },
                { type: "text" },
                { type: "badge" },
                { type: "badge" },
                { type: "text" },
              ]}
            />
          )}

          {!loading && campuses.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Không có cơ sở nào phù hợp.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            campuses.map((c, i) => (
              <TableRow key={c._id}>
                <TableCell className="text-center font-medium">
                  {i + 1}
                </TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.address}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>
                  {c.manager ? (
                    <div>
                      <p className="font-medium text-sm">
                        {c.manager.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.manager.email}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Chưa có
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {getActiveStatusBadge(
                    c.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onEdit(c)}
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleStatus(c)}
                        className="cursor-pointer"
                      >
                        {c.status === "ACTIVE" ? (
                          <>
                            <PauseCircle className="h-4 w-4" />
                            Tạm ngưng
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4" />
                            Kích hoạt
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(c._id)}
                        className="text-red-600 focus:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
