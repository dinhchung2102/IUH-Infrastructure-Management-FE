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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import type {
  Report,
  ReportStatus,
  ReportPriority,
} from "../types/report.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ReportTableProps {
  reports: Report[];
  onViewDetails: (report: Report) => void;
  onUpdateStatus: (reportId: string, status: ReportStatus) => void;
}

const getStatusBadge = (status: ReportStatus) => {
  const variants = {
    PENDING: {
      variant: "secondary" as const,
      label: "Chờ xử lý",
      className: "",
    },
    IN_PROGRESS: {
      variant: "default" as const,
      label: "Đang xử lý",
      className: "",
    },
    RESOLVED: {
      variant: "default" as const,
      label: "Đã giải quyết",
      className: "bg-green-600",
    },
    REJECTED: {
      variant: "destructive" as const,
      label: "Đã từ chối",
      className: "",
    },
  };
  const config = variants[status];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const getPriorityBadge = (priority: ReportPriority) => {
  const variants = {
    LOW: { variant: "outline" as const, label: "Thấp", className: "" },
    MEDIUM: {
      variant: "secondary" as const,
      label: "Trung bình",
      className: "",
    },
    HIGH: {
      variant: "default" as const,
      label: "Cao",
      className: "bg-orange-600",
    },
    URGENT: {
      variant: "destructive" as const,
      label: "Khẩn cấp",
      className: "",
    },
  };
  const config = variants[priority];
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ReportTable({
  reports,
  onViewDetails,
  onUpdateStatus,
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
            <TableHead className="w-[120px]">Mã báo cáo</TableHead>
            <TableHead>Người báo cáo</TableHead>
            <TableHead>Thiết bị</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Mức độ</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report._id}>
              <TableCell className="font-medium">{report.reportCode}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={report.reporter.avatar} />
                    <AvatarFallback className="text-xs">
                      {getUserInitials(report.reporter.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {report.reporter.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {report.reporter.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{report.asset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {report.asset.code}
                  </p>
                </div>
              </TableCell>
              <TableCell>{report.type.label}</TableCell>
              <TableCell>{getStatusBadge(report.status)}</TableCell>
              <TableCell>{getPriorityBadge(report.priority)}</TableCell>
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
                            onUpdateStatus(report._id, "IN_PROGRESS")
                          }
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Đang xử lý
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(report._id, "RESOLVED")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Đã giải quyết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(report._id, "REJECTED")}
                          className="text-destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Từ chối
                        </DropdownMenuItem>
                      </>
                    )}
                    {report.status === "IN_PROGRESS" && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(report._id, "RESOLVED")}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Đã giải quyết
                      </DropdownMenuItem>
                    )}
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
