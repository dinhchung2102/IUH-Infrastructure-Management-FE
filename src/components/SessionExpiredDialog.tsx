import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/user/auth/components";
import { toast } from "sonner";

/**
 * Global component to handle session expiration
 * Listens to 'token-expired' event from axios interceptor
 */
export function SessionExpiredDialog() {
  const [showAlert, setShowAlert] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const handleTokenExpired = () => {
      setShowAlert(true);
    };

    // Listen for token-expired event from axios interceptor
    window.addEventListener("token-expired", handleTokenExpired);

    return () => {
      window.removeEventListener("token-expired", handleTokenExpired);
    };
  }, []);

  const handleLoginClick = () => {
    setShowAlert(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    toast.success("Đăng nhập thành công!");
    // Reload page to refresh data with new token
    window.location.reload();
  };

  return (
    <>
      {/* Session Expired Alert Dialog */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Phiên đăng nhập đã hết hạn</AlertDialogTitle>
            <AlertDialogDescription>
              Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp
              tục sử dụng hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleLoginClick} className="w-full">
              Đăng nhập lại
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Login Dialog */}
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
