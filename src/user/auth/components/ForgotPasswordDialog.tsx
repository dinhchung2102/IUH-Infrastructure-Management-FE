import { HelpCircle, Mail, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  onSwitchToLogin,
}: ForgotPasswordDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="size-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Quên mật khẩu?
          </DialogTitle>
          <DialogDescription className="text-center">
            Liên hệ với chúng tôi để được hỗ trợ đặt lại mật khẩu
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-green-500/10 p-3">
                  <Phone className="size-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Hotline hỗ trợ</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Gọi điện trực tiếp để được hỗ trợ nhanh nhất
                  </p>
                  <a
                    href="tel:02838940390"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    028 3894 0390
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-blue-500/10 p-3">
                  <Mail className="size-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Email hỗ trợ</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Gửi email để được hỗ trợ đặt lại mật khẩu
                  </p>
                  <a
                    href="mailto:support@iuh.edu.vn"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    support@iuh.edu.vn
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              Vui lòng cung cấp thông tin tài khoản của bạn khi liên hệ để được
              hỗ trợ nhanh chóng
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onSwitchToLogin?.();
              }}
            >
              Quay lại đăng nhập
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                window.location.href = "tel:02838940390";
              }}
            >
              <Phone className="size-4 mr-2" />
              Gọi ngay
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
