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
import { converGenderToDisplay } from "@/utils/convertDisplay.util";
import { Mars, Venus, Mail, Phone, MapPin, Calendar, User } from "lucide-react";
import type { AccountResponse } from "../types/account.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface AccountDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: AccountResponse | null;
  loading: boolean;
}

export function AccountDetailDialog({
  open,
  onOpenChange,
  account,
  loading,
}: AccountDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài khoản</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về tài khoản trong hệ thống
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : account ? (
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center space-y-4 pb-4 border-b">
              <Avatar className="size-24">
                <AvatarImage src={account.avatar} alt={account.fullName} />
                <AvatarFallback className="text-2xl">
                  {account.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-semibold">
                  {account.fullName || "Chưa có tên"}
                </h3>
                <p className="text-sm text-muted-foreground">{account.email}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {account.role?.roleName &&
                    getRoleBadge(account.role.roleName)}
                  {getAccountStatusBadge(account.isActive)}
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
                      {account.fullName || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-sm">{account.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {account.gender === "MALE" ? (
                    <Mars className="h-5 w-5 text-blue-500 mt-0.5" />
                  ) : (
                    <Venus className="h-5 w-5 text-pink-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Giới tính
                    </p>
                    <p className="text-sm">
                      {converGenderToDisplay(account.gender) || "Chưa xác định"}
                    </p>
                  </div>
                </div>

                {account.dateOfBirth && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Ngày sinh
                      </p>
                      <p className="text-sm">
                        {format(new Date(account.dateOfBirth), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                  </div>
                )}

                {account.phoneNumber && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Số điện thoại
                      </p>
                      <p className="text-sm">
                        {account.phoneNumber || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                )}

                {account.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Địa chỉ
                      </p>
                      <p className="text-sm">
                        {account.address || "Chưa cập nhật"}
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
                {(account.createdAt || account.updatedAt) && (
                  <div className="grid grid-cols-2 gap-4">
                    {account.createdAt && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Ngày tạo
                          </p>
                          <p className="text-sm">
                            {format(
                              new Date(account.createdAt),
                              "dd/MM/yyyy HH:mm",
                              { locale: vi }
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {account.updatedAt && (
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Cập nhật lần cuối
                          </p>
                          <p className="text-sm">
                            {format(
                              new Date(account.updatedAt),
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
