import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import {
  TableActionMenu,
  type TableAction,
} from "@/components/TableActionMenu";
import type { Report, ReportStatus } from "../types/report.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getReportStatusBadge,
  getReportTypeBadge,
  getPriorityBadge,
} from "@/config/badge.config";

interface ReportTableProps {
  reports: Report[];
  onViewDetails: (report: Report) => void;
  onUpdateStatus: (reportId: string, status: ReportStatus) => void;
  currentPage: number;
  itemsPerPage: number;
}

export function ReportTable({
  reports,
  onViewDetails,
  onUpdateStatus,
  currentPage,
  itemsPerPage,
}: ReportTableProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-md border bg-white">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy báo cáo nào</p>
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
            <TableHead>Người báo cáo</TableHead>
            <TableHead>Thiết bị</TableHead>
            <TableHead>Vị trí</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Độ ưu tiên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => {
            const stt = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <TableRow key={report._id}>
                <TableCell className="text-center font-medium">{stt}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">
                      {report.createdBy.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {report.createdBy.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {report.asset.image ? (
                      <img
                        src={`${import.meta.env.VITE_URL_UPLOADS}${
                          report.asset.image
                        }`}
                        alt={report.asset.name}
                        className="h-12 w-12 rounded object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center border">
                        <span className="text-xs text-gray-400">N/A</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{report.asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.asset.code}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p className="font-medium">{report.location?.campus}</p>
                    {report.location?.building && (
                      <p className="text-xs text-muted-foreground">
                        {report.location.building}
                      </p>
                    )}
                    {report.location?.zone && (
                      <p className="text-xs text-muted-foreground">
                        {report.location.zone}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getReportTypeBadge(report.type)}</TableCell>
                <TableCell>
                  {report.priority ? getPriorityBadge(report.priority) : "-"}
                </TableCell>
                <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">
                      {format(new Date(report.createdAt), "dd/MM/yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(report.createdAt), "HH:mm", {
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
                        onClick: () => onViewDetails(report),
                      },
                      ...(report.status === "PENDING"
                        ? [
                            {
                              label: "Duyệt báo cáo",
                              icon: CheckCircle,
                              onClick: () =>
                                onUpdateStatus(report._id, "APPROVED"),
                            } as TableAction,
                            {
                              label: "Từ chối",
                              icon: XCircle,
                              onClick: () =>
                                onUpdateStatus(report._id, "REJECTED"),
                              variant: "destructive" as const,
                            } as TableAction,
                          ]
                        : []),
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
