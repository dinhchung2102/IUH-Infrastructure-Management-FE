"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MaintenanceList({ events }: { events: any[] }) {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Tên công việc</TableHead>
            <TableHead>Thiết bị</TableHead>
            <TableHead>Ngày dự kiến</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ưu tiên</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {events.map((e, i) => (
            <TableRow key={e.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{e.title}</TableCell>
              <TableCell>{e.device}</TableCell>
              <TableCell>{e.start}</TableCell>

              {/* Trạng thái */}
              <TableCell>
                {e.status === "COMPLETED" && (
                  <Badge variant="success">Hoàn thành</Badge>
                )}
                {e.status === "PENDING" && (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 border border-yellow-300"
                  >
                    Chờ thực hiện
                  </Badge>
                )}
                {e.status === "CANCELLED" && (
                  <Badge variant="destructive">Đã hủy</Badge>
                )}
              </TableCell>

              {/* Ưu tiên */}
              <TableCell>
                {e.priority === "HIGH" && (
                  <Badge variant="destructive">Cao</Badge>
                )}
                {e.priority === "MEDIUM" && (
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 border border-amber-300"
                  >
                    Trung bình
                  </Badge>
                )}
                {e.priority === "LOW" && (
                  <Badge variant="secondary">Thấp</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
