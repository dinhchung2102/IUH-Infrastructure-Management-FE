import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, Mail } from "lucide-react";
import type { AuditLog } from "../types/audit.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { ImageViewer } from "@/components/ImageViewer";
import { useState } from "react";
import { getAssetStatusConfig } from "@/utils/assetStatus.util";

interface AuditDetailDialogProps {
  audit: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
    IN_PROGRESS: {
      label: "Đang xử lý",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200",
    },
    COMPLETED: {
      label: "Hoàn thành",
      className:
        "bg-green-100 text-green-700 hover:bg-green-100 border-green-200",
    },
    CANCELLED: {
      label: "Đã hủy",
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

const getReportTypeConfig = (type: string) => {
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

export function AuditDetailDialog({
  audit,
  open,
  onOpenChange,
}: AuditDetailDialogProps) {
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!audit) return null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  // Combine report images and audit images with VITE_URL_UPLOADS
  const allImages = [
    ...(audit.report?.images || []).map(
      (img) => `${import.meta.env.VITE_URL_UPLOADS}${img}`
    ),
    ...audit.images.map((img) => `${import.meta.env.VITE_URL_UPLOADS}${img}`),
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[88vh]">
          <DialogHeader className="space-y-2 pb-2">
            <div className="flex items-center">
              <DialogTitle className="text-lg flex items-center gap-2">
                Chi tiết nhiệm vụ
              </DialogTitle>
              <div className="flex items-center gap-1.5 pl-4">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    getStatusConfig(audit.status).className
                  }`}
                >
                  {getStatusConfig(audit.status).label}
                </Badge>
                {audit.report?.type && (
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      getReportTypeConfig(audit.report.type).className
                    }`}
                  >
                    {getReportTypeConfig(audit.report.type).label}
                  </Badge>
                )}
              </div>
            </div>
            {/* Subject-ID & Timeline - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm font-medium">{audit.subject}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {audit._id.slice(-8)}
                </p>
              </div>
              <div className="bg-muted/30 rounded-md p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      Ngày tạo
                    </span>
                  </div>
                  <p className="font-medium text-xs">
                    {format(new Date(audit.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
                {audit.expiresAt && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">
                        Hết hạn
                      </span>
                    </div>
                    <p className="font-medium text-xs">
                      {format(new Date(audit.expiresAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      Cập nhật
                    </span>
                  </div>
                  <p className="font-medium text-xs">
                    {format(new Date(audit.updatedAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(88vh-140px)]">
            <div className="space-y-3 pr-3">
              {/* Reporter Info - Only show if from report */}
              {audit.report && (
                <>
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                      Người báo cáo
                    </h3>
                    <div className="flex items-center gap-2.5 bg-muted/30 rounded-md p-2.5">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(audit.report.createdBy.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <p className="font-medium text-xs truncate">
                            {audit.report.createdBy.fullName}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <p className="text-[11px] text-muted-foreground truncate">
                            {audit.report.createdBy.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              <Separator />

              {/* Asset Info & Location - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Asset Info */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                    Thông tin thiết bị
                  </h3>
                  <div className="bg-muted/30 rounded-md p-2.5 h-full">
                    <div className="flex items-start gap-3">
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
                          className="h-20 w-20 rounded-md object-cover border flex-shrink-0"
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center border flex-shrink-0">
                          <span className="text-[10px] text-muted-foreground">
                            N/A
                          </span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-0.5">
                            Tên thiết bị
                          </p>
                          <p className="font-medium text-sm truncate">
                            {audit.report?.asset?.name ||
                              audit.asset?.name ||
                              "Chưa có tên"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-0.5">
                            Trạng thái
                          </p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              getAssetStatusConfig(
                                audit.report?.asset?.status ||
                                  audit.asset?.status ||
                                  "IN_USE"
                              ).className
                            }`}
                          >
                            {
                              getAssetStatusConfig(
                                audit.report?.asset?.status ||
                                  audit.asset?.status ||
                                  "IN_USE"
                              ).label
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                    Vị trí
                  </h3>
                  <div className="bg-muted/30 rounded-md p-2.5 h-full flex flex-col">
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-0.5">
                            Cơ sở
                          </p>
                          <p className="font-medium text-xs">
                            {audit.location?.campus || "Chưa xác định"}
                          </p>
                        </div>
                        {audit.location?.building && (
                          <div>
                            <p className="text-[11px] text-muted-foreground mb-0.5">
                              Tòa nhà
                            </p>
                            <p className="font-medium text-xs">
                              {audit.location.building}
                            </p>
                          </div>
                        )}
                      </div>
                      {audit.location?.zone && (
                        <div>
                          <p className="text-[11px] text-muted-foreground mb-0.5">
                            Khu vực
                          </p>
                          <p className="font-medium text-xs">
                            {audit.location.zone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Staffs */}
              {audit.staffs.length > 0 && (
                <>
                  <div className="space-y-1.5 pt-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                      Nhân viên được phân công ({audit.staffs.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {audit.staffs.map((staff) => (
                        <div
                          key={staff._id}
                          className="flex items-center gap-2 bg-muted/30 rounded-md p-2"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-[10px]">
                              {getUserInitials(staff.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-xs truncate">
                              {staff.fullName}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {staff.email}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Report Description - Only show if from report */}
              {audit.report && (
                <div className="space-y-1.5 pt-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                    Mô tả sự cố
                  </h3>
                  <div className="bg-muted/30 rounded-md p-2.5">
                    <p className="text-xs leading-relaxed whitespace-pre-wrap">
                      {audit.report.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Images */}
              {allImages.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                      Hình ảnh đính kèm ({allImages.length})
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {allImages.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-md border overflow-hidden group relative aspect-video cursor-pointer hover:border-primary transition-colors"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={image}
                            alt={`Hình ảnh ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                            {index + 1}/{allImages.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Image Viewer */}
      <ImageViewer
        images={allImages}
        initialIndex={selectedImageIndex}
        open={imageViewerOpen}
        onOpenChange={setImageViewerOpen}
      />
    </>
  );
}
