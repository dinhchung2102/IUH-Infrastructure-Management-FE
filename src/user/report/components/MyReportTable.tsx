import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { MyReport } from "../api/report.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getReportStatusBadge,
  getReportTypeBadge,
} from "@/config/badge.config";

interface MyReportTableProps {
  reports: MyReport[];
  onViewDetail: (report: MyReport) => void;
}

export function MyReportTable({ reports, onViewDetail }: MyReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Không có báo cáo nào</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center w-[60px]">STT</TableHead>
            <TableHead>Thiết bị</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => {
            const location = report.asset.zone
              ? report.asset.zone.name
              : report.asset.area
              ? report.asset.area.name
              : "N/A";

            return (
              <TableRow key={report._id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{report.asset.name}</div>
                    <div className="text-sm text-gray-500">
                      {report.asset.code} - {location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getReportTypeBadge(report.type)}</TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate" title={report.description}>
                    {report.description}
                  </div>
                </TableCell>
                <TableCell>
                  {getReportStatusBadge(report.status)}
                </TableCell>
                <TableCell>
                  {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetail(report)}
                    className="cursor-pointer"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Xem chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

