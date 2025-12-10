import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { MyReport } from "../api/report.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useState } from "react";
import {
  getReportStatusBadge,
  getReportTypeBadge,
} from "@/config/badge.config";

interface MyReportDetailDialogProps {
  report: MyReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyReportDetailDialog({
  report,
  open,
  onOpenChange,
}: MyReportDetailDialogProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!report) return null;

  const location = report.asset.zone
    ? report.asset.zone.name
    : report.asset.area
    ? report.asset.area.name
    : "N/A";

  const imageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) return imagePath;
    return `${import.meta.env.VITE_URL_UPLOADS || ""}${imagePath}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết báo cáo</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về báo cáo của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className="flex gap-4">
            <div>
              <span className="text-sm text-gray-500">Trạng thái: </span>
              {getReportStatusBadge(report.status)}
            </div>
            <div>
              <span className="text-sm text-gray-500">Loại: </span>
              {getReportTypeBadge(report.type)}
            </div>
          </div>

          {/* Asset Info */}
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Thông tin thiết bị</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Tên thiết bị: </span>
                <span className="font-medium">{report.asset.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Mã thiết bị: </span>
                <span className="font-medium">{report.asset.code}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Vị trí: </span>
                <span className="font-medium">{location}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Mô tả</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{report.description}</p>
          </div>

          {/* Images */}
          {report.images && report.images.length > 0 && (
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold">Hình ảnh ({report.images.length})</h3>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative w-full h-64 rounded-lg overflow-hidden border">
                  <img
                    src={imageUrl(report.images[selectedImageIndex])}
                    alt={`Hình ảnh ${selectedImageIndex + 1}`}
                    className="w-full h-full object-contain bg-gray-50"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x300?text=Image+Not+Found";
                    }}
                  />
                </div>

                {/* Thumbnail Grid */}
                {report.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {report.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={imageUrl(image)}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/100x100?text=Error";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">Thông tin báo cáo</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Người báo cáo: </span>
                <span className="font-medium">{report.createdBy.fullName}</span>
              </div>
              <div>
                <span className="text-gray-500">Email: </span>
                <span className="font-medium">{report.createdBy.email}</span>
              </div>
              <div>
                <span className="text-gray-500">Ngày tạo: </span>
                <span className="font-medium">
                  {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Cập nhật lần cuối: </span>
                <span className="font-medium">
                  {format(new Date(report.updatedAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

