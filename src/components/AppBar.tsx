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
} from "lucide-react";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import logoImage from "@/assets/logo/iuh_logo-official.png";
import {
  LoginDialog,
  RegisterDialog,
  ForgotPasswordDialog,
} from "@/user/auth/components";
import { toast } from "sonner";

type DialogType = "login" | "register" | "forgotPassword" | null;

export default function AppBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    // Hide when scrolling down and past threshold
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

  const handleLoginSuccess = () => {
    toast.success("Đăng nhập thành công!");
    // Redirect to admin page after successful login
    setTimeout(() => {
      navigate("/admin");
    }, 500);
  };

  const handleRegisterSuccess = () => {
    toast.success("Đăng ký thành công!");
    // Redirect to admin page after successful registration
    setTimeout(() => {
      navigate("/admin");
    }, 500);
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
        className="px-6 sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-18 items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img
                src={logoImage}
                alt="IUH Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex md:flex-1 items-center justify-center gap-1 w-full">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-8 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
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
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 hover:text-primary"
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
                <SheetTitle>Menu</SheetTitle>
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
                          ? "text-primary font-semibold"
                          : "text-foreground/70 hover:text-primary"
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="mobile-nav-indicator"
                          className="absolute inset-0 bg-primary/10 rounded-lg"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon
                        className={`h-5 w-5 relative z-10 ${
                          active ? "text-primary" : ""
                        }`}
                      />
                      <span className="font-medium relative z-10">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
              <div className="flex flex-col gap-2 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  className="w-full hover:bg-primary/10 hover:text-primary hover:border-primary"
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
        onSwitchToOTP={handleRegisterSuccess}
      />

      <ForgotPasswordDialog
        open={activeDialog === "forgotPassword"}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        onSwitchToLogin={() => {
          setActiveDialog(null);
          setTimeout(() => setActiveDialog("login"), 100);
        }}
      />
    </>
  );
}
