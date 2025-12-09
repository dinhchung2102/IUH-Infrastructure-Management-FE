import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccountStatusBadge, getRoleBadge } from "@/config/badge.config";
import { converGenderToDisplay, converRoleToDisplay } from "@/utils/convertDisplay.util";
import { Mars, Venus, Mail, Phone, MapPin, Calendar, User, Building2, Map, Home } from "lucide-react";
import type { StaffResponse } from "../types/staff.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface StaffDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffResponse | null;
  loading: boolean;
}

export function StaffDetailDialog({
  open,
  onOpenChange,
  staff,
  loading,
}: StaffDetailDialogProps) {
  const getAvatarUrl = (avatar?: string) => {
    if (!avatar) return undefined;
    return avatar.startsWith("http")
      ? avatar
      : `${import.meta.env.VITE_URL_UPLOADS}${avatar}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết nhân viên</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về nhân viên trong hệ thống
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : staff ? (
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center space-y-4 pb-4 border-b">
              <Avatar className="size-24">
                {staff.avatar && (
                  <AvatarImage
                    src={getAvatarUrl(staff.avatar)}
                    alt={staff.fullName}
                  />
                )}
                <AvatarFallback className="text-2xl">
                  {staff.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-semibold">
                  {staff.fullName || "Chưa có tên"}
                </h3>
                <p className="text-sm text-muted-foreground">{staff.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {staff.role?.roleName &&
                    getRoleBadge(staff.role.roleName)}
                  {getAccountStatusBadge(staff.isActive)}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Thông tin cá nhân
              </h4>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Họ và tên
                    </p>
                    <p className="text-sm">
                      {staff.fullName || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{staff.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {staff.gender === "MALE" ? (
                    <Mars className="h-5 w-5 text-blue-500 mt-0.5" />
                  ) : (
                    <Venus className="h-5 w-5 text-pink-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Giới tính
                    </p>
                    <p className="text-sm">
                      {staff.gender
                        ? converGenderToDisplay(staff.gender)
                        : "Chưa xác định"}
                    </p>
                  </div>
                </div>

                {staff.dateOfBirth && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Ngày sinh
                      </p>
                      <p className="text-sm">
                        {format(new Date(staff.dateOfBirth), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {staff.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Số điện thoại
                      </p>
                      <p className="text-sm">
                        {staff.phoneNumber || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                )}

                {staff.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Địa chỉ
                      </p>
                      <p className="text-sm">
                        {staff.address || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Thông tin tài khoản
              </h4>
              <div className="grid gap-4">
                {(staff.createdAt || staff.updatedAt) && (
                  <div className="grid grid-cols-2 gap-4">
                    {staff.createdAt && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Ngày tạo
                          </p>
                          <p className="text-sm">
                            {format(
                              new Date(staff.createdAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: vi }
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {staff.updatedAt && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Cập nhật lần cuối
                          </p>
                          <p className="text-sm">
                            {format(
                              new Date(staff.updatedAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: vi }
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Managed Locations */}
            {(staff.campusManaged ||
              staff.areasManaged?.length ||
              staff.zonesManaged?.length ||
              staff.buildingsManaged?.length) && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Khu vực quản lý
                </h4>
                <div className="grid gap-4">
                  {staff.campusManaged && (
                    <div className="flex items-start gap-3">
                      <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Cơ sở quản lý
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {staff.campusManaged.name}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {staff.buildingsManaged && staff.buildingsManaged.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Tòa nhà quản lý ({staff.buildingsManaged.length})
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {staff.buildingsManaged.map((building) => (
                            <Badge key={building._id} variant="outline">
                              {building.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {staff.areasManaged && staff.areasManaged.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Map className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Khu vực ngoài trời quản lý ({staff.areasManaged.length})
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {staff.areasManaged.map((area) => (
                            <Badge key={area._id} variant="outline">
                              {area.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {staff.zonesManaged && staff.zonesManaged.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Map className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          Phòng - Khu vực quản lý ({staff.zonesManaged.length})
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {staff.zonesManaged.map((zone) => (
                            <Badge key={zone._id} variant="outline">
                              {zone.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Không có dữ liệu
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

