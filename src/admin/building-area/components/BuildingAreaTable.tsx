import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { TableActionMenu } from "@/components/TableActionMenu";
import {
  getActiveStatusBadge,
  getBuildingAreaTypeBadge,
} from "@/config/badge.config";
import { ZoneTypeHoverCard } from "./ZoneTypeHoverCard";
import type { BuildingAreaItem } from "../hooks";

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
            <TableHead>Tòa nhà/ Khu vực</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Cơ sở</TableHead>
            <TableHead>Số tầng</TableHead>
            <TableHead>Chức năng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-center w-20">Thao tác</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Đang tải dữ liệu...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
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
                  {item.type === "BUILDING" ? (
                    <span className="text-sm font-medium">
                      {item.floor ?? "—"}
                    </span>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {item.type === "AREA" && item.zoneType ? (
                    <ZoneTypeHoverCard zoneType={item.zoneType} />
                  ) : (
                    "—"
                  )}
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
                  <TableActionMenu
                    showLabel
                    actions={[
                      {
                        label: "Chỉnh sửa",
                        icon: Edit,
                        onClick: () => onEdit(item),
                      },
                      {
                        label: "Xóa",
                        icon: Trash2,
                        onClick: () => onDelete(item),
                        variant: "destructive",
                      },
                    ]}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
