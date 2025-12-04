import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "iuh-facilities-disclaimer-accepted";

/**
 * Disclaimer dialog component
 * Shows a disclaimer notice when user first visits the public pages
 * Only displays on public pages (not admin pages)
 */
export function DisclaimerDialog() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user is on admin page
    const isAdminPage = location.pathname.startsWith("/admin");

    // Don't show on admin pages
    if (isAdminPage) {
      return;
    }

    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem(STORAGE_KEY) === "true";

    if (!hasAccepted) {
      setOpen(true);
    }
  }, [location.pathname]);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  // Don't render on admin pages
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent
        className="max-w-2xl"
        showCloseButton={false}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Thông báo</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 pt-4 text-left">
              <p>
                Đây là website phục vụ cho đề tài "Quản lý cơ sở vật chất tại
                Trường Đại học Công Nghiệp TP.HCM", được thực hiện dưới sự hướng
                dẫn của Thầy Nguyễn Văn Thắng.
              </p>
              <p>
                Website không thuộc và không đại diện cho Trường Đại học Công
                Nghiệp TP.HCM.
              </p>
              <p>
                Toàn bộ nội dung và dữ liệu chỉ mang tính minh họa cho mục đích
                học tập.
              </p>
              <p>
                Chúng tôi không chịu trách nhiệm đối với mọi hiểu nhầm, sai sót
                hoặc thiệt hại phát sinh từ việc sử dụng website này.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAccept} className="w-full sm:w-auto">
            Đồng ý
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
