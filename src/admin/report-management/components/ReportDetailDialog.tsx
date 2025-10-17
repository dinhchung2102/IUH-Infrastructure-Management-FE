import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Mail, FileText, CheckCircle2 } from "lucide-react";
import type { Report } from "../types/report.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ImageViewer } from "@/components/ImageViewer";
import { useState } from "react";
import { getAssetStatusConfig } from "@/utils/assetStatus.util";
import { Button } from "@/components/ui/button";
import { ApproveReportDialog } from "./ApproveReportDialog";

interface ReportDetailDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproveSuccess?: () => void;
}

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getStatusConfig = (status: string) => {
  const statusMap: Record<string, { label: string; className: string }> = {
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
  return (
    statusMap[status] || {
      label: status,
      className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    }
  );
};

const getTypeConfig = (type: string) => {
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
  return (
    typeMap[type] || {
      label: type,
      className: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
    }
  );
};

export function ReportDetailDialog({
  report,
  open,
  onOpenChange,
  onApproveSuccess,
}: ReportDetailDialogProps) {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  if (!report) return null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const handleApproveClick = () => {
    setApproveDialogOpen(true);
  };

  const handleApproveSuccess = () => {
    if (onApproveSuccess) {
      onApproveSuccess();
    }
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Chi tiết báo cáo
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về báo cáo sự cố
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6 pr-4">
              {/* Status & Type */}
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={getStatusConfig(report.status).className}
                >
                  {getStatusConfig(report.status).label}
                </Badge>
                <Badge
                  variant="outline"
                  className={getTypeConfig(report.type).className}
                >
                  {getTypeConfig(report.type).label}
                </Badge>
              </div>

              <Separator />

              {/* Reporter Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Người báo cáo</h3>
                <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                  <Avatar className="h-14 w-14 flex-shrink-0">
                    <AvatarFallback className="text-base">
                      {getUserInitials(report.createdBy.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <p className="font-semibold text-base truncate">
                        {report.createdBy.fullName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground truncate">
                        {report.createdBy.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Asset Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Thông tin thiết bị
                </h3>
                <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                  {report.asset.image ? (
                    <img
                      src={`${import.meta.env.VITE_URL_UPLOADS}${
                        report.asset.image
                      }`}
                      alt={report.asset.name}
                      className="h-20 w-20 rounded-lg object-cover border-2 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center border-2 flex-shrink-0">
                      <span className="text-sm text-gray-400">N/A</span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Tên thiết bị
                      </p>
                      <p className="font-semibold truncate">
                        {report.asset.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Mã thiết bị
                      </p>
                      <p className="font-semibold text-primary">
                        {report.asset.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Trạng thái
                      </p>
                      <Badge
                        variant="outline"
                        className={
                          getAssetStatusConfig(report.asset.status).className
                        }
                      >
                        {getAssetStatusConfig(report.asset.status).label}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Location Info & Timeline - 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Info */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Vị trí báo cáo</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Cơ sở</p>
                      <p className="font-medium">{report.location?.campus}</p>
                    </div>
                    {report.location?.building && (
                      <div>
                        <p className="text-xs text-muted-foreground">Tòa nhà</p>
                        <p className="font-medium">
                          {report.location.building}
                        </p>
                      </div>
                    )}
                    {report.location?.zone && (
                      <div>
                        <p className="text-xs text-muted-foreground">Khu vực</p>
                        <p className="font-medium">{report.location.zone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Thời gian</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Ngày tạo
                        </span>
                      </div>
                      <p className="font-medium text-sm">
                        {format(
                          new Date(report.createdAt),
                          "dd/MM/yyyy HH:mm",
                          {
                            locale: vi,
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Cập nhật
                        </span>
                      </div>
                      <p className="font-medium text-sm">
                        {format(
                          new Date(report.updatedAt),
                          "dd/MM/yyyy HH:mm",
                          {
                            locale: vi,
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description & Images - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Mô tả sự cố</h3>
                  <div className="bg-muted/50 rounded-lg p-4 h-full min-h-[200px]">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {report.description}
                    </p>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Hình ảnh đính kèm ({report.images.length})
                  </h3>
                  {report.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {report.images.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-lg border overflow-hidden group relative aspect-video cursor-pointer"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={`${import.meta.env.VITE_URL_UPLOADS}${image}`}
                            alt={`Hình ảnh ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {index + 1}/{report.images.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-8 text-center min-h-[200px] flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Không có hình ảnh đính kèm
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Dialog Footer with Action Buttons */}
          {report.status === "PENDING" && (
            <DialogFooter className="border-t pt-4">
              <Button
                onClick={handleApproveClick}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Phê duyệt báo cáo
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer */}
      <ImageViewer
        images={report.images.map(
          (img) => `${import.meta.env.VITE_URL_UPLOADS}${img}`
        )}
        initialIndex={selectedImageIndex}
        open={imageViewerOpen}
        onOpenChange={setImageViewerOpen}
      />

      {/* Approve Report Dialog */}
      <ApproveReportDialog
        report={report}
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        onSuccess={handleApproveSuccess}
      />
    </>
  );
}
