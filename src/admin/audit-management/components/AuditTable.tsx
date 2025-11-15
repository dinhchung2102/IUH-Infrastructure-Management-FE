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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  PlayCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { AuditLog, AuditStatus } from "../types/audit.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  getAuditStatusBadge,
  getReportTypeBadge,
} from "@/config/badge.config";

interface AuditTableProps {
  auditLogs: AuditLog[];
  onViewDetails: (audit: AuditLog) => void;
  onUpdateStatus: (auditId: string, status: AuditStatus) => void;
  currentPage: number;
  itemsPerPage: number;
}

export function AuditTable({
  auditLogs,
  onViewDetails,
  onUpdateStatus,
  currentPage,
  itemsPerPage,
}: AuditTableProps) {
  if (auditLogs.length === 0) {
    return (
      <div className="rounded-md border bg-white">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy công việc nào</p>
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
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Thiết bị</TableHead>
            <TableHead>Vị trí</TableHead>
            <TableHead>Loại báo cáo</TableHead>
            <TableHead>Nhân viên</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs.map((audit, index) => {
            const stt = (currentPage - 1) * itemsPerPage + index + 1;
            return (
              <TableRow key={audit._id}>
                <TableCell className="text-center font-medium">{stt}</TableCell>
                <TableCell>
                  <div className="max-w-[250px]">
                    <p className="text-sm font-medium truncate">
                      {audit.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      ID: {audit._id.slice(-8)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {audit.report.asset.image ? (
                      <img
                        src={`${import.meta.env.VITE_URL_UPLOADS}${
                          audit.report.asset.image
                        }`}
                        alt={audit.report.asset.name}
                        className="h-12 w-12 rounded object-cover border"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center border">
                        <span className="text-xs text-gray-400">N/A</span>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {audit.report.asset.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {audit.report.asset.code}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-[150px]">
                    <p className="font-medium truncate">
                      {audit.location?.campus}
                    </p>
                    {audit.location?.building && (
                      <p className="text-xs text-muted-foreground truncate">
                        {audit.location.building}
                      </p>
                    )}
                    {audit.location?.zone && (
                      <p className="text-xs text-muted-foreground truncate">
                        {audit.location.zone}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {getReportTypeBadge(audit.report.type)}
                </TableCell>
                <TableCell>
                  <div className="max-w-[150px]">
                    {audit.staffs.length > 0 ? (
                      <>
                        <p className="text-sm font-medium truncate">
                          {audit.staffs[0].fullName}
                        </p>
                        {audit.staffs.length > 1 && (
                          <p className="text-xs text-muted-foreground">
                            +{audit.staffs.length - 1} người khác
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">Chưa có</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getAuditStatusBadge(audit.status)}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">
                      {format(new Date(audit.createdAt), "dd/MM/yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(audit.createdAt), "HH:mm", {
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
                      <DropdownMenuItem onClick={() => onViewDetails(audit)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      {audit.status === "PENDING" && (
                        <DropdownMenuItem
                          onClick={() =>
                            onUpdateStatus(audit._id, "IN_PROGRESS")
                          }
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Bắt đầu xử lý
                        </DropdownMenuItem>
                      )}
                      {audit.status === "IN_PROGRESS" && (
                        <>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(audit._id, "COMPLETED")
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Hoàn thành
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(audit._id, "CANCELLED")
                            }
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Hủy
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
