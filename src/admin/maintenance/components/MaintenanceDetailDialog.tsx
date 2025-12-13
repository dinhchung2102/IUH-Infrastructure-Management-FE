"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getMaintenanceById } from "../api/maintenance.api";
import {
  getMaintenanceStatusBadge,
  getPriorityBadge,
} from "@/config/badge.config";
import type { Maintenance } from "../types/maintenance.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar,
  User,
  Package,
  FileText,
  Image as ImageIcon,
  Edit,
} from "lucide-react";
import { ImageViewer } from "@/components/ImageViewer";

interface MaintenanceDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceId: string | null;
  onEdit?: (maintenance: Maintenance) => void;
}

export function MaintenanceDetailDialog({
  open,
  onOpenChange,
  maintenanceId,
  onEdit,
}: MaintenanceDetailDialogProps) {
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  useEffect(() => {
    if (open && maintenanceId) {
      fetchMaintenanceDetail();
    } else if (!open) {
      setMaintenance(null);
      setSelectedImageIndex(null);
    }
  }, [open, maintenanceId]);

  const fetchMaintenanceDetail = async () => {
    if (!maintenanceId) return;

    try {
      setLoading(true);
      const response = await getMaintenanceById(maintenanceId);
      if (response.success && response.data) {
        // Handle nested data structure
        const data =
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data
            ? (response.data as { data: Maintenance }).data
            : (response.data as Maintenance);
        setMaintenance(data);
      } else {
        console.error("Failed to fetch maintenance detail");
      }
    } catch (error) {
      console.error("Error fetching maintenance detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const handleEditClick = () => {
    if (maintenance && onEdit) {
      onEdit(maintenance);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">Chi tiết lịch bảo trì</DialogTitle>
              {maintenance && onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </DialogHeader>

          {loading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : maintenance ? (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {/* Title and Status */}
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-xl font-semibold">
                      {maintenance.title}
                    </h3>
                    <div className="flex gap-2 shrink-0">
                      {getMaintenanceStatusBadge(maintenance.status)}
                      {getPriorityBadge(maintenance.priority)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Asset Information */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Thông tin thiết bị
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Tên thiết bị:
                      </span>
                      <p className="font-medium">{maintenance.asset.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mã thiết bị:</span>
                      <p className="font-medium">{maintenance.asset.code}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <p className="font-medium">{maintenance.asset.status}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Mô tả
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {maintenance.description}
                  </p>
                </div>

                {/* Schedule Information */}
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Thông tin lịch trình
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Ngày dự kiến:
                      </span>
                      <p className="font-medium">
                        {format(
                          new Date(maintenance.scheduledDate),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi }
                        )}
                      </p>
                    </div>
                    {maintenance.completedDate && (
                      <div>
                        <span className="text-muted-foreground">
                          Ngày hoàn thành:
                        </span>
                        <p className="font-medium">
                          {format(
                            new Date(maintenance.completedDate),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Assigned Staff */}
                {maintenance.assignedTo.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Người được gán ({maintenance.assignedTo.length})
                      </h4>
                      <div className="space-y-2">
                        {maintenance.assignedTo.map((staff) => (
                          <div
                            key={staff._id}
                            className="flex items-center gap-2 p-2 rounded border bg-muted/30"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {staff.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {staff.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                {maintenance.notes && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Ghi chú
                      </h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {maintenance.notes}
                      </p>
                    </div>
                  </>
                )}

                {/* Images */}
                {maintenance.images && maintenance.images.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Hình ảnh ({maintenance.images.length})
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {maintenance.images.map((image, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-video rounded border overflow-hidden bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleImageClick(idx)}
                          >
                            <img
                              src={`${
                                import.meta.env.VITE_URL_UPLOADS || ""
                              }${image}`}
                              alt={`Image ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder-image.png";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Created By */}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Người tạo:</span>
                    <p className="font-medium">
                      {maintenance.createdBy.fullName} (
                      {maintenance.createdBy.email})
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ngày tạo:</span>
                    <p className="font-medium">
                      {format(
                        new Date(maintenance.createdAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cập nhật lần cuối:</span>
                    <p className="font-medium">
                      {format(
                        new Date(maintenance.updatedAt),
                        "dd/MM/yyyy HH:mm",
                        { locale: vi }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground py-8">
              Không tìm thấy thông tin lịch bảo trì
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Viewer */}
      {maintenance?.images && selectedImageIndex !== null && (
        <ImageViewer
          images={maintenance.images.map(
            (img) => `${import.meta.env.VITE_URL_UPLOADS || ""}${img}`
          )}
          initialIndex={selectedImageIndex}
          open={imageViewerOpen}
          onOpenChange={(open) => {
            setImageViewerOpen(open);
            if (!open) {
              setSelectedImageIndex(null);
            }
          }}
        />
      )}
    </>
  );
}

