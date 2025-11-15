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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit3, MoreHorizontal, Trash2 } from "lucide-react";
import {
  getActiveStatusBadge,
  getBuildingAreaTypeBadge,
} from "@/config/badge.config";

interface BuildingAreaItem {
  _id: string;
  name: string;
  type: "BUILDING" | "AREA";
  status: string;
  floor?: number;
  description?: string;
  campus?: {
    _id: string;
    name: string;
  };
}

interface BuildingAreaTableProps {
  items: BuildingAreaItem[];
  loading: boolean;
  onEdit: (item: BuildingAreaItem) => void;
  onDelete: (item: BuildingAreaItem) => void;
}

export function BuildingAreaTable({
  items,
  loading,
  onEdit,
  onDelete,
}: BuildingAreaTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-12">STT</TableHead>
            <TableHead>Tòa nhà/ Khu vực ngoài trời</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Cơ sở</TableHead>
            <TableHead>Chi tiết</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center w-20">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, i) => (
              <TableRow key={item._id}>
                <TableCell className="text-center">{i + 1}</TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{getBuildingAreaTypeBadge(item.type)}</TableCell>
                <TableCell>{item.campus?.name || "Không rõ"}</TableCell>
                <TableCell>
                  {item.type === "BUILDING"
                    ? `Tầng: ${item.floor ?? "—"}`
                    : item.description || "—"}
                </TableCell>
                <TableCell>
                  {getActiveStatusBadge(
                    item.status === "UNDERMAINTENANCE"
                      ? "UNDERMAINTENANCE"
                      : item.status === "ACTIVE"
                      ? "ACTIVE"
                      : "INACTIVE"
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onEdit(item)}
                        className="cursor-pointer"
                      >
                        <Edit3 className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
