import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Building2,
  Package,
  Calendar,
  User,
  Mail,
  FileText,
} from "lucide-react";
import type { Report } from "../types/report.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ReportDetailDialogProps {
  report: Report | null;
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

export function ReportDetailDialog({
  report,
  open,
  onOpenChange,
}: ReportDetailDialogProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chi tiết báo cáo - {report.reportCode}
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về báo cáo sự cố
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Status & Priority */}
            <div className="flex items-center gap-2">
              <Badge
                variant={report.status === "RESOLVED" ? "default" : "secondary"}
                className={report.status === "RESOLVED" ? "bg-green-600" : ""}
              >
                {report.status}
              </Badge>
              <Badge
                variant={
                  report.priority === "URGENT" ? "destructive" : "outline"
                }
              >
                {report.priority}
              </Badge>
              <Badge variant="outline">{report.type.label}</Badge>
            </div>

            <Separator />

            {/* Reporter Info */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Người báo cáo</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={report.reporter.avatar} />
                  <AvatarFallback>
                    {getUserInitials(report.reporter.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{report.reporter.fullName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {report.reporter.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Asset Info */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Thông tin thiết bị</h3>
              <div className="grid grid-cols-2 gap-4">
                {report.asset.image && (
                  <div className="rounded-lg border overflow-hidden">
                    <img
                      src={report.asset.image}
                      alt={report.asset.name}
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tên thiết bị
                    </p>
                    <p className="font-medium">{report.asset.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mã thiết bị</p>
                    <p className="font-medium text-primary">
                      {report.asset.code}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Location */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Vị trí</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm">{report.location.campus}</span>
                </div>
                {report.location.building && (
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {report.location.building} - Tầng {report.location.floor}
                    </span>
                  </div>
                )}
                {report.location.zone && (
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm">{report.location.zone}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Mô tả sự cố</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {report.description}
              </p>
            </div>

            {/* Images */}
            {report.images.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    Hình ảnh đính kèm
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {report.images.map((image, index) => (
                      <div
                        key={index}
                        className="rounded-lg border overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`Hình ảnh ${index + 1}`}
                          className="w-full h-32 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Thời gian</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Ngày tạo:</span>
                  <span className="font-medium">
                    {format(new Date(report.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Cập nhật:</span>
                  <span className="font-medium">
                    {format(new Date(report.updatedAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </span>
                </div>
                {report.resolvedAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground">Giải quyết:</span>
                    <span className="font-medium text-green-600">
                      {format(new Date(report.resolvedAt), "dd/MM/yyyy HH:mm", {
                        locale: vi,
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
