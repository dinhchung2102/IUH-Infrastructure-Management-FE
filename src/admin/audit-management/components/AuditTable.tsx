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
import { TableSkeleton } from "@/components/TableSkeleton";
import type { AuditLog, AuditStatus } from "../types/audit.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getAuditStatusBadge, getReportTypeBadge } from "@/config/badge.config";

interface AuditTableProps {
  auditLogs: AuditLog[];
  onViewDetails: (audit: AuditLog) => void;
  onUpdateStatus: (auditId: string, status: AuditStatus) => void;
  currentPage: number;
  itemsPerPage: number;
  loading?: boolean;
}

export function AuditTable({
  auditLogs,
  onViewDetails,
  onUpdateStatus,
  currentPage,
  itemsPerPage,
  loading = false,
}: AuditTableProps) {
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
            <TableHead>Ngày hết hạn</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableSkeleton
              rows={5}
              columns={[
                { type: "number", width: "w-[60px]", align: "center" },
                { type: "text", width: "w-[200px]" },
                { type: "avatar", width: "w-[200px]" },
                { type: "text", width: "w-[150px]" },
                { type: "badge", width: "w-[100px]" },
                { type: "text", width: "w-[150px]" },
                { type: "badge", width: "w-[100px]" },
                { type: "text", width: "w-[120px]" },
                { type: "text", width: "w-[80px]", align: "right" },
              ]}
            />
          ) : auditLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12">
                <p className="text-muted-foreground">
                  Không tìm thấy công việc nào
                </p>
              </TableCell>
            </TableRow>
          ) : (
            auditLogs.map((audit, index) => {
              const stt = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <TableRow key={audit._id}>
                  <TableCell className="text-center font-medium">
                    {stt}
                  </TableCell>
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
                      {audit.report?.asset?.image || audit.asset?.image ? (
                        <img
                          src={`${import.meta.env.VITE_URL_UPLOADS}${
                            audit.report?.asset?.image || audit.asset?.image
                          }`}
                          alt={
                            audit.report?.asset?.name ||
                            audit.asset?.name ||
                            "Asset"
                          }
                          className="h-12 w-12 rounded object-cover border"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center border">
                          <span className="text-xs text-gray-400">N/A</span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {audit.report?.asset?.name ||
                            audit.asset?.name ||
                            "Chưa có tên"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {audit.report?.asset?.code ||
                            audit.asset?.code ||
                            "N/A"}
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
                    {audit.report?.type ? (
                      getReportTypeBadge(audit.report.type)
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        Không có báo cáo
                      </span>
                    )}
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
                    {audit.expiresAt ? (
                      <div>
                        <p className="text-sm">
                          {format(new Date(audit.expiresAt), "dd/MM/yyyy")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(audit.expiresAt), "HH:mm", {
                            locale: vi,
                          })}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Chưa có</p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <TableActionMenu
                      showLabel
                      actions={[
                        {
                          label: "Xem chi tiết",
                          icon: Eye,
                          onClick: () => onViewDetails(audit),
                        },
                        ...(audit.status === "IN_PROGRESS"
                          ? [
                              {
                                label: "Hoàn thành",
                                icon: CheckCircle,
                                onClick: () =>
                                  onUpdateStatus(audit._id, "COMPLETED"),
                              } as TableAction,
                              {
                                label: "Hủy",
                                icon: XCircle,
                                onClick: () =>
                                  onUpdateStatus(audit._id, "CANCELLED"),
                                variant: "destructive" as const,
                              } as TableAction,
                            ]
                          : []),
                      ]}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
