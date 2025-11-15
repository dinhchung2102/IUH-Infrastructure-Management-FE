import { Menu, Bell, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Account } from "@/types/response.type";
import { logout } from "@/user/auth/api/auth.api";
import { toast } from "sonner";
import { getUserInitials, getRoleDisplay } from "@/utils/formatDisplay.util";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CommandPalette } from "@/components/CommandPalette";

interface AdminTopBarProps {
  onMenuClick: () => void;
}

export default function AdminTopBar({ onMenuClick }: AdminTopBarProps) {
  const navigate = useNavigate();
  const [account, setAccount] = useState<Account | null>(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount && storedAccount !== "undefined") {
      try {
        const parsedAccount = JSON.parse(storedAccount);
        setAccount(parsedAccount);
      } catch (error) {
        console.error("Failed to parse account data:", error);
      }
    }
  }, []);

  const confirmLogout = async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error: any) {
      if (error?.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("account");
        localStorage.removeItem("remembered_email");
        toast.info("Phiên đăng nhập đã hết hạn");
        navigate("/");
      } else {
        toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
      }
    } finally {
      setShowLogoutAlert(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        {/* Search */}
        <div className="flex-1 hidden md:flex">
          <CommandPalette />
        </div>

        {/* Actions */}
        <div className="flex items-center flex-1 justify-end">
          {/* Back to Home */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
            title="Về trang chủ"
            className="hidden md:block"
          >
            <Home className="size-6" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="mr-4 hidden md:flex">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-6" />
                <Badge
                  variant="destructive"
                  className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <div className="flex w-full items-start justify-between">
                    <p className="text-sm font-medium">Báo cáo mới</p>
                    <Badge variant="secondary" className="text-xs">
                      Mới
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Có 2 báo cáo cần xem xét
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <p className="text-sm font-medium">Bảo trì định kỳ</p>
                  <p className="text-xs text-muted-foreground">
                    Nhắc nhở: Bảo trì phòng A101 vào ngày mai
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-3">
                  <p className="text-sm font-medium">Cập nhật hệ thống</p>
                  <p className="text-xs text-muted-foreground">
                    Phiên bản 1.0.1 đã sẵn sàng
                  </p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-center text-sm font-medium text-primary">
                Xem tất cả thông báo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          {account && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="size-10">
                    <AvatarImage
                      src={account.avatar || undefined}
                      alt={account.fullName || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials(account.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-sm font-medium">
                      {account.fullName || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {getRoleDisplay(account.role)}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin/profile")}>
                  Hồ sơ cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowLogoutAlert(true)}
                  className="text-destructive focus:text-destructive"
                >
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLogout}>
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
