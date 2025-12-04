import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getActiveStatusBadge } from "@/config/badge.config";
import { TableSkeleton } from "@/components/TableSkeleton";
import { TableActionMenu } from "@/components/TableActionMenu";
import { Pencil, Trash2 } from "lucide-react";

/* =========================================
   Icon & màu cho loại zone
========================================= */
const zoneTypeDisplay = {
  FUNCTIONAL: {
    label: "Chức năng",
    color: "bg-purple-100 text-purple-700 border border-purple-300",
  },
  TECHNICAL: {
    label: "Kỹ thuật",
    color: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  SERVICE: {
    label: "Dịch vụ",
    color: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  PUBLIC: {
    label: "Công cộng",
    color: "bg-green-100 text-green-700 border border-green-300",
  },
};

import type { ZoneResponse } from "../api/zone.api";

type ZoneItem = ZoneResponse;

interface ZoneTableProps {
  zones: ZoneItem[];
  loading: boolean;
  onEdit: (zone: ZoneItem) => void;
  onDelete: (id: string) => void;
}

export function ZoneTable({
  zones,
  loading,
  onEdit,
  onDelete,
}: ZoneTableProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-12">#</TableHead>
            <TableHead>Tên khu vực</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Tòa nhà</TableHead>
            <TableHead>Cơ sở</TableHead>
            <TableHead>Tầng</TableHead>
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
                { type: "badge" },
                { type: "text" },
                { type: "text" },
                { type: "text" },
                { type: "badge" },
                { type: "text" },
              ]}
            />
          )}

          {!loading && zones.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                Không có khu vực nào phù hợp.
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            zones.map((z, i) => {
              const zt =
                zoneTypeDisplay[z.zoneType as keyof typeof zoneTypeDisplay];

              return (
                <TableRow key={z._id}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell className="font-medium">{z.name}</TableCell>
                  <TableCell>
                    {zt ? (
                      <Badge className={`flex items-center gap-1 ${zt.color}`}>
                        {zt.label}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    {typeof z.building === "object" && z.building?.name
                      ? z.building.name
                      : typeof z.area === "object" && z.area?.name
                      ? z.area.name
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {typeof z.building === "object" && z.building?.campus?.name
                      ? z.building.campus.name
                      : typeof z.area === "object" && z.area?.campus?.name
                      ? z.area.campus.name
                      : "—"}
                  </TableCell>
                  <TableCell>{z.floorLocation ?? "—"}</TableCell>
                  <TableCell>
                    {getActiveStatusBadge(
                      z.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <TableActionMenu
                      showLabel
                      actions={[
                        {
                          label: "Chỉnh sửa",
                          icon: Pencil,
                          onClick: () => onEdit(z),
                        },
                        {
                          label: "Xóa",
                          icon: Trash2,
                          onClick: () => onDelete(z._id),
                          variant: "destructive",
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
