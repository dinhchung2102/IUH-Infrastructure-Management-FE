import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import type { Report, ReportStatus } from "../types/report.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ReportTableProps {
  reports: Report[];
  onViewDetails: (report: Report) => void;
  onUpdateStatus: (reportId: string, status: ReportStatus) => void;
  currentPage: number;
  itemsPerPage: number;
}

const getStatusBadge = (status: ReportStatus) => {
  const statusMap = {
    PENDING: {
      label: "Chờ xử lý",
      className:
        "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200",
    },
    APPROVED: {
      label: "Đã duyệt",
      className:
        "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    },
    REJECTED: {
      label: "Đã từ chối",
      className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    },
  };
  const config = statusMap[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

const getTypeBadge = (type: string) => {
  const typeMap: Record<string, { label: string; className: string }> = {
    DAMAGED: {
      label: "Hư hỏng",
      className: "bg-red-100 text-red-700 hover:bg-red-100 border-red-200",
    },
    MAINTENANCE: {
      label: "Bảo trì",
      className:
        "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    },
    LOST: {
      label: "Mất thiết bị",
      className:
        "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
    },
    BUY_NEW: {
      label: "Mua mới",
      className:
        "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    },
    OTHER: {
      label: "Khác",
      className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    },
  };
  const config = typeMap[type] || {
    label: type,
    className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
  };
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

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
                        src={report.asset.image}
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
                <TableCell>{getTypeBadge(report.type)}</TableCell>
                <TableCell>{getStatusBadge(report.status)}</TableCell>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetails(report)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {report.status === "PENDING" && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(report._id, "APPROVED")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Duyệt báo cáo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(report._id, "REJECTED")
                            }
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Từ chối
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
