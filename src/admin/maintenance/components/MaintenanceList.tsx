"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getMaintenanceStatusBadge,
  getPriorityBadge,
} from "@/config/badge.config";

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
                {getMaintenanceStatusBadge(e.status)}
              </TableCell>

              {/* Ưu tiên */}
              <TableCell>
                {getPriorityBadge(e.priority)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
