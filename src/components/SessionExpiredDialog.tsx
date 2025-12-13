import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showStaffAlert, setShowStaffAlert] = useState(false);

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
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      try {
        const parsedAccount = JSON.parse(storedAccount);
        toast.success("Đăng nhập thành công!");

        // Handle different roles
        const role = parsedAccount.role;

        if (role === "STAFF") {
          // Show alert dialog for STAFF role
          setShowStaffAlert(true);
        } else if (
          role === "STUDENT" ||
          role === "GUEST" ||
          role === "LECTURER"
        ) {
          // Stay on current page (reload) for STUDENT, GUEST, LECTURER
          window.location.reload();
        } else {
          // Navigate to admin for other roles (mainly ADMIN)
          setTimeout(() => {
            navigate("/admin");
          }, 500);
        }
      } catch (error) {
        console.error("Failed to parse account data:", error);
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
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

      {/* Staff Role Alert Dialog */}
      <AlertDialog open={showStaffAlert} onOpenChange={setShowStaffAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thông báo</AlertDialogTitle>
            <AlertDialogDescription>
              Tài khoản của bạn là nhân viên. Vui lòng sử dụng ứng dụng dành cho
              nhân viên của Phòng quản trị để sử dụng các chức năng quản lý.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setShowStaffAlert(false)}
              className="cursor-pointer"
            >
              Đã hiểu
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
