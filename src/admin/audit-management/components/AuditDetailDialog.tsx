import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  Mail,
  ClipboardList,
  Users,
  FileText,
} from "lucide-react";
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
    ...audit.report.images.map(
      (img) => `${import.meta.env.VITE_URL_UPLOADS}${img}`
    ),
    ...audit.images.map((img) => `${import.meta.env.VITE_URL_UPLOADS}${img}`),
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Chi tiết công việc bảo trì
            </DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về công việc bảo trì và sửa chữa
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="space-y-6 pr-4">
              {/* Subject & Status */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold">{audit.subject}</h3>
                  <p className="text-sm text-muted-foreground">
                    ID: {audit._id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStatusConfig(audit.status).className}
                  >
                    {getStatusConfig(audit.status).label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getReportTypeConfig(audit.report.type).className}
                  >
                    {getReportTypeConfig(audit.report.type).label}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Reporter Info & Asset Info - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reporter Info */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Người báo cáo sự cố
                  </h3>
                  <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                    <Avatar className="h-14 w-14 flex-shrink-0">
                      <AvatarFallback className="text-base">
                        {getUserInitials(audit.report.createdBy.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="font-semibold text-base truncate">
                          {audit.report.createdBy.fullName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm text-muted-foreground truncate">
                          {audit.report.createdBy.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Asset Info */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Thông tin thiết bị
                  </h3>
                  <div className="flex items-start gap-4 bg-muted/30 rounded-lg p-4">
                    {audit.report.asset.image ? (
                      <img
                        src={`${import.meta.env.VITE_URL_UPLOADS}${
                          audit.report.asset.image
                        }`}
                        alt={audit.report.asset.name}
                        className="h-20 w-20 rounded-lg object-cover border-2 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-lg bg-gray-100 flex items-center justify-center border-2 flex-shrink-0">
                        <span className="text-sm text-gray-400">N/A</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Tên thiết bị
                        </p>
                        <p className="font-semibold truncate">
                          {audit.report.asset.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Mã thiết bị
                        </p>
                        <p className="font-semibold text-primary">
                          {audit.report.asset.code}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Trạng thái
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            getAssetStatusConfig(audit.report.asset.status)
                              .className
                          }
                        >
                          {
                            getAssetStatusConfig(audit.report.asset.status)
                              .label
                          }
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Assigned Staffs */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  <Users className="h-4 w-4 inline mr-2" />
                  Nhân viên được phân công ({audit.staffs.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {audit.staffs.map((staff) => (
                    <div
                      key={staff._id}
                      className="flex items-center gap-3 bg-muted/30 rounded-lg p-3"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-xs">
                          {getUserInitials(staff.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">
                          {staff.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {staff.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Location & Timeline - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location Info */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Vị trí</h3>
                  <div className="space-y-2 bg-muted/30 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Cơ sở</p>
                      <p className="font-medium">{audit.location?.campus}</p>
                    </div>
                    {audit.location?.building && (
                      <div>
                        <p className="text-xs text-muted-foreground">Tòa nhà</p>
                        <p className="font-medium">{audit.location.building}</p>
                      </div>
                    )}
                    {audit.location?.zone && (
                      <div>
                        <p className="text-xs text-muted-foreground">Khu vực</p>
                        <p className="font-medium">{audit.location.zone}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Thời gian</h3>
                  <div className="space-y-3 bg-muted/30 rounded-lg p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Ngày tạo
                        </span>
                      </div>
                      <p className="font-medium text-sm">
                        {format(new Date(audit.createdAt), "dd/MM/yyyy HH:mm", {
                          locale: vi,
                        })}
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
                        {format(new Date(audit.updatedAt), "dd/MM/yyyy HH:mm", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Report Description & Images - 2 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Mô tả sự cố ban đầu
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-4 min-h-[150px]">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {audit.report.description}
                    </p>
                  </div>
                </div>

                {/* Report Images */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Hình ảnh sự cố ({audit.report.images.length})
                  </h3>
                  {audit.report.images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {audit.report.images.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-lg border overflow-hidden group relative aspect-video cursor-pointer"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={`${import.meta.env.VITE_URL_UPLOADS}${image}`}
                            alt={`Hình ảnh sự cố ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {index + 1}/{audit.report.images.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted/30 rounded-lg p-8 text-center min-h-[150px] flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">
                        Không có hình ảnh
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Audit Work Images (if any) */}
              {audit.images.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Hình ảnh công việc ({audit.images.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {audit.images.map((image, index) => (
                        <div
                          key={index}
                          className="rounded-lg border overflow-hidden group relative aspect-video cursor-pointer"
                          onClick={() =>
                            handleImageClick(audit.report.images.length + index)
                          }
                        >
                          <img
                            src={`${import.meta.env.VITE_URL_UPLOADS}${image}`}
                            alt={`Hình ảnh công việc ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                            {index + 1}/{audit.images.length}
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
