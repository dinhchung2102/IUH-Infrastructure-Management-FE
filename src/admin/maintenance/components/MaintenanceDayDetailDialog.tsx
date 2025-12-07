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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  status: string;
  priority: string;
  asset: string;
}

interface MaintenanceDayDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
  events: CalendarEvent[];
}

export function MaintenanceDayDetailDialog({
  open,
  onOpenChange,
  date,
  events,
}: MaintenanceDayDetailDialogProps) {
  const [selectedMaintenance, setSelectedMaintenance] =
    useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch maintenance detail when event is selected
  const fetchMaintenanceDetail = async (maintenanceId: string) => {
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
        setSelectedMaintenance(data);
      }
    } catch (error) {
      console.error("Error fetching maintenance detail:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-select first event when dialog opens
  useEffect(() => {
    if (open && events.length > 0 && !selectedMaintenance) {
      fetchMaintenanceDetail(events[0].id);
    }
  }, [open, events]);

  // Reset selected maintenance when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedMaintenance(null);
    }
  }, [open]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "OVERDUE":
        return "bg-red-100 text-red-700 border-red-200";
      case "CANCELLED":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!date) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Lịch bảo trì ngày {format(date, "dd/MM/yyyy", { locale: vi })}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 flex-1 min-h-0 mt-4">
          {/* Left Side - Events List */}
          <div className="w-1/3 border-r pr-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground mb-3">
              Danh sách ({events.length})
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {events.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    Không có lịch bảo trì nào
                  </div>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => fetchMaintenanceDetail(event.id)}
                      className={cn(
                        "p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted",
                        selectedMaintenance?._id === event.id &&
                          "bg-primary/5 border-primary"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium line-clamp-2 flex-1">
                          {event.title}
                        </h4>
                        <div
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded border shrink-0",
                            getStatusColor(event.status)
                          )}
                        >
                          {event.status === "COMPLETED"
                            ? "Hoàn thành"
                            : event.status === "PENDING"
                            ? "Chờ thực hiện"
                            : event.status === "IN_PROGRESS"
                            ? "Đang thực hiện"
                            : event.status === "OVERDUE"
                            ? "Quá hạn"
                            : "Đã hủy"}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.asset}
                      </p>
                      <div className="mt-2">
                        {getPriorityBadge(event.priority)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Maintenance Detail */}
          <div className="flex-1 flex flex-col min-w-0">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : selectedMaintenance ? (
              <ScrollArea className="flex-1">
                <div className="space-y-6 pr-4">
                  {/* Title and Status */}
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-semibold">
                        {selectedMaintenance.title}
                      </h3>
                      <div className="flex gap-2 shrink-0">
                        {getMaintenanceStatusBadge(selectedMaintenance.status)}
                        {getPriorityBadge(selectedMaintenance.priority)}
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
                        <p className="font-medium">
                          {selectedMaintenance.asset.name}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Mã thiết bị:
                        </span>
                        <p className="font-medium">
                          {selectedMaintenance.asset.code}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          Trạng thái:
                        </span>
                        <p className="font-medium">
                          {selectedMaintenance.asset.status}
                        </p>
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
                      {selectedMaintenance.description}
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
                            new Date(selectedMaintenance.scheduledDate),
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </p>
                      </div>
                      {selectedMaintenance.completedDate && (
                        <div>
                          <span className="text-muted-foreground">
                            Ngày hoàn thành:
                          </span>
                          <p className="font-medium">
                            {format(
                              new Date(selectedMaintenance.completedDate),
                              "dd/MM/yyyy HH:mm",
                              { locale: vi }
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assigned Staff */}
                  {selectedMaintenance.assignedTo.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Người được gán (
                          {selectedMaintenance.assignedTo.length})
                        </h4>
                        <div className="space-y-2">
                          {selectedMaintenance.assignedTo.map((staff) => (
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
                  {selectedMaintenance.notes && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Ghi chú
                        </h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {selectedMaintenance.notes}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Images */}
                  {selectedMaintenance.images &&
                    selectedMaintenance.images.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="font-medium flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            Hình ảnh ({selectedMaintenance.images.length})
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {selectedMaintenance.images.map((image, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-video rounded border overflow-hidden bg-muted"
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
                        {selectedMaintenance.createdBy.fullName} (
                        {selectedMaintenance.createdBy.email})
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày tạo:</span>
                      <p className="font-medium">
                        {format(
                          new Date(selectedMaintenance.createdAt),
                          "dd/MM/yyyy HH:mm",
                          { locale: vi }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Chọn một lịch bảo trì để xem chi tiết
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
