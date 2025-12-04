import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import {
  Menu,
  Home,
  Info,
  Newspaper,
  FileText,
  Mail,
  Building,
  User,
  LogOut,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import logoImage from "@/assets/logo/iuh_logo-official.png";
import {
  LoginDialog,
  RegisterDialog,
  OTPDialog,
  ForgotPasswordDialog,
  ResetPasswordDialog,
} from "@/user/auth/components";
import { toast } from "sonner";
import { logout } from "@/user/auth/api/auth.api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import type { Account } from "@/types/response.type";
import { getRoleDisplay } from "@/utils/formatDisplay.util";
import { AxiosError } from "axios";

type DialogType =
  | "login"
  | "register"
  | "otp"
  | "forgotPassword"
  | "resetPassword"
  | null;

export default function AppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [otpEmail, setOtpEmail] = useState("");
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [account, setAccount] = useState<Account | null>(null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showTokenExpiredAlert, setShowTokenExpiredAlert] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isActive = (path: string) => {
    // Exact match for home, starts with for others
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: "/", label: "Trang chủ", icon: Home },
    { path: "/about", label: "Giới thiệu", icon: Info },
    { path: "/facilities", label: "Cơ sở vật chất", icon: Building },
    { path: "/news", label: "Tin tức", icon: Newspaper },
    { path: "/report", label: "Báo cáo sự cố", icon: FileText },
    { path: "/contact", label: "Liên hệ", icon: Mail },
  ];

  useEffect(() => {
    // Load account from localStorage on mount
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      try {
        const parsedAccount = JSON.parse(storedAccount);
        if (
          parsedAccount &&
          typeof parsedAccount === "object" &&
          parsedAccount.email
        ) {
          setAccount(parsedAccount);
        } else {
          console.warn("Invalid account data in localStorage");
          localStorage.removeItem("account");
        }
      } catch (error) {
        console.error("Failed to parse account data:", error);
        localStorage.removeItem("account");
      }
    }
  }, []);

  useEffect(() => {
    const onTokenExpired = () => {
      // Show alert dialog when refresh token fails
      setShowTokenExpiredAlert(true);
      // Ensure any mobile sheet is closed
      setOpen(false);
    };

    window.addEventListener("token-expired", onTokenExpired as EventListener);
    return () => {
      window.removeEventListener(
        "token-expired",
        onTokenExpired as EventListener
      );
    };
  }, []);

  const handleLoginSuccess = () => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount) {
      try {
        const parsedAccount = JSON.parse(storedAccount);
        setAccount(parsedAccount);
        toast.success("Đăng nhập thành công!");

        // Only redirect to admin if role is ADMIN
        if (parsedAccount.role === "ADMIN") {
          setTimeout(() => {
            navigate("/admin");
          }, 500);
        }
      } catch (error) {
        console.error("Failed to parse account data:", error);
      }
    }
  };

  const handleRegisterSuccess = () => {
    console.log("handleRegisterSuccess called");
    const storedAccount = localStorage.getItem("account");
    console.log("storedAccount:", storedAccount);

    if (storedAccount && storedAccount !== "undefined") {
      try {
        const parsedAccount = JSON.parse(storedAccount);
        console.log("parsedAccount:", parsedAccount);
        console.log("Account avatar:", parsedAccount.avatar);
        setAccount(parsedAccount);
        console.log("Account state updated");

        // Show success toast
        toast.success("Đăng ký tài khoản thành công!");

        // Redirect based on role
        if (parsedAccount.role === "ADMIN") {
          setTimeout(() => {
            navigate("/admin");
          }, 500);
        }
        // Other roles (STUDENT, STAFF, GUEST, TEACHER) stay on current page
      } catch (error) {
        console.error("Failed to parse account data:", error);
        toast.error("Đăng ký thành công nhưng có lỗi khi đăng nhập.");
      }
    } else {
      console.log("No stored account found or account is undefined");
      // Show toast anyway to indicate success
      toast.success("Đăng ký thành công!");
    }
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setAccount(null);
      setShowLogoutAlert(false);
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error: unknown) {
      console.error("Logout error:", error);
      // Even if API fails, clear local data
      localStorage.removeItem("access_token");
      localStorage.removeItem("account");
      localStorage.removeItem("remembered_email");
      setAccount(null);
      setShowLogoutAlert(false);

      // Check if it's a token expiration error
      if (error instanceof AxiosError && error.response?.status === 401) {
        toast.success("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        toast.error("Đăng xuất thất bại");
      }
    }
  };

  const handleTokenExpiredConfirm = () => {
    setShowTokenExpiredAlert(false);
    setAccount(null);
    navigate("/");
    // Force login dialog to appear
    setTimeout(() => setActiveDialog("login"), 50);
  };

  return (
    <>
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-18 items-center justify-between gap-4">
          {/* Logo Section - Fixed Width */}
          <div className="flex items-center w-[200px] shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={logoImage}
                alt="IUH Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-8 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  isActive(item.path) ? "" : "opacity-70 hover:opacity-100"
                }`}
                style={{ color: "#204195" }}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 rounded-full"
                    style={{ backgroundColor: "#204195" }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section - Fixed Width */}
          <div className="hidden md:flex items-center gap-2 justify-end w-[200px] shrink-0">
            {account ? (
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 bg-transparent hover:bg-transparent cursor-pointer"
                    style={{ color: "#204195" }}
                  >
                    <span className="font-semibold">
                      {account?.fullName || "User"}
                    </span>
                    {popoverOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 px-2 py-1.5">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#204195" }}
                      >
                        {account?.fullName || "User"}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#204195", opacity: 0.7 }}
                      >
                        {getRoleDisplay(account?.role)}
                      </p>
                    </div>
                    <div className="h-px bg-border my-1" />
                    <Button
                      variant="ghost"
                      className="justify-start gap-2"
                      style={{ color: "#204195" }}
                      asChild
                    >
                      <a href="/profile" className="cursor-pointer">
                        <User className="size-4" />
                        Hồ sơ
                      </a>
                    </Button>
                    {account?.role === "ADMIN" && (
                      <Button
                        variant="ghost"
                        className="justify-start gap-2"
                        style={{ color: "#204195" }}
                        asChild
                      >
                        <a href="/admin" className="cursor-pointer">
                          <Settings className="size-4" />
                          Quản trị
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="justify-start cursor-pointer gap-2 text-destructive hover:text-destructive"
                      onClick={() => setShowLogoutAlert(true)}
                    >
                      <LogOut className="size-4" />
                      Đăng xuất
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="hover:bg-primary/10"
                  style={{ color: "#204195" }}
                  onClick={() => setActiveDialog("login")}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 shadow-md"
                  onClick={() => setActiveDialog("register")}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle style={{ color: "#204195" }}>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? "font-semibold"
                          : "opacity-70 hover:opacity-100"
                      }`}
                      style={{ color: "#204195" }}
                    >
                      {active && (
                        <motion.div
                          layoutId="mobile-nav-indicator"
                          className="absolute inset-0 rounded-lg"
                          style={{ backgroundColor: "rgba(32, 65, 149, 0.1)" }}
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon
                        className="h-5 w-5 relative z-10"
                        style={{ color: "#204195" }}
                      />
                      <span className="font-medium relative z-10">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              {/* Mobile Auth Section */}
              <div className="mt-6 pt-6 border-t">
                {account ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1 px-2 py-2">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#204195" }}
                      >
                        {account?.fullName || "User"}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#204195", opacity: 0.7 }}
                      >
                        {getRoleDisplay(account?.role)}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      style={{ color: "#204195" }}
                      asChild
                      onClick={() => setOpen(false)}
                    >
                      <a href="/profile">
                        <User className="size-4" />
                        Hồ sơ
                      </a>
                    </Button>
                    {account?.role === "ADMIN" && (
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        style={{ color: "#204195" }}
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <a href="/admin">
                          <Settings className="size-4" />
                          Quản trị
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive"
                      onClick={() => {
                        setOpen(false);
                        setShowLogoutAlert(true);
                      }}
                    >
                      <LogOut className="size-4" />
                      Đăng xuất
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full hover:bg-primary/10 hover:border-primary"
                      style={{ color: "#204195" }}
                      onClick={() => {
                        setOpen(false);
                        setActiveDialog("login");
                      }}
                    >
                      Đăng nhập
                    </Button>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 shadow-md"
                      onClick={() => {
                        setOpen(false);
                        setActiveDialog("register");
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>

      {/* Authentication Dialogs */}
      <LoginDialog
        open={activeDialog === "login"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onSwitchToRegister={() => {
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("register"), 100);
        }}
        onSwitchToForgotPassword={() => {
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("forgotPassword"), 100);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      <RegisterDialog
        open={activeDialog === "register"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onSwitchToLogin={() => {
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("login"), 100);
        }}
        onSwitchToOTP={(email) => {
          setOtpEmail(email);
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("otp"), 100);
        }}
      />

      <OTPDialog
        open={activeDialog === "otp"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        email={otpEmail}
        onVerifySuccess={handleRegisterSuccess}
      />

      <ForgotPasswordDialog
        open={activeDialog === "forgotPassword"}
        onOpenChange={(open: boolean) => !open && setActiveDialog(null)}
        onSwitchToLogin={() => {
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("login"), 100);
        }}
        onSwitchToResetPassword={(email: string) => {
          setResetPasswordEmail(email);
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("resetPassword"), 100);
        }}
      />

      <ResetPasswordDialog
        open={activeDialog === "resetPassword"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        email={resetPasswordEmail}
        onSwitchToLogin={() => {
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("login"), 100);
        }}
      />

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống? Bạn sẽ cần đăng
              nhập lại để sử dụng các tính năng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            >
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Token Expired Dialog */}
      <AlertDialog
        open={showTokenExpiredAlert}
        onOpenChange={setShowTokenExpiredAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Phiên đăng nhập đã hết hạn</AlertDialogTitle>
            <AlertDialogDescription>
              Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp
              tục sử dụng hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={handleTokenExpiredConfirm}
            >
              Đăng nhập lại
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
