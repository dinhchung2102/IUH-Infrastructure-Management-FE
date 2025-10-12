import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Calendar,
  BookOpen,
  ChevronRight,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import logoImage from "@/assets/logo/iuh_logo-official.png";

interface AdminSidebarProps {
  className?: string;
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const navigation = [
  {
    title: "Tổng quan",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Thống kê",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Quản lý",
    items: [
      {
        title: "Cơ sở vật chất",
        href: "/admin/facilities",
        icon: Building2,
      },
      {
        title: "Người dùng",
        href: "/admin/users",
        icon: Users,
      },
      {
        title: "Báo cáo",
        href: "/admin/reports",
        icon: FileText,
      },
      {
        title: "Tin tức",
        href: "/admin/news",
        icon: BookOpen,
      },
      {
        title: "Đặt phòng",
        href: "/admin/bookings",
        icon: Calendar,
      },
      {
        title: "Thiết bị",
        href: "/admin/equipment",
        icon: Building2,
      },
      {
        title: "Bảo trì",
        href: "/admin/maintenance-list",
        icon: Settings,
      },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      {
        title: "Lịch bảo trì",
        href: "/admin/maintenance",
        icon: Calendar,
      },
      {
        title: "Phản hồi",
        href: "/admin/feedback",
        icon: MessageSquare,
      },
      {
        title: "Cài đặt",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Xem website",
        href: "/",
        icon: Globe,
      },
    ],
  },
];

function SidebarContent() {
  const location = useLocation();

  const findSectionByPath = (pathname: string): string => {
    let bestMatchSection = "";
    let bestMatchLength = -1;

    for (const section of navigation) {
      for (const item of section.items) {
        if (item.href === "/") continue; // external link

        // Exact match takes priority
        if (pathname === item.href) {
          const length = item.href.length;
          if (length > bestMatchLength) {
            bestMatchLength = length;
            bestMatchSection = section.title;
          }
          continue;
        }

        // Prefix match for nested routes, prefer the longest href
        if (pathname.startsWith(item.href + "/")) {
          const length = item.href.length;
          if (length > bestMatchLength) {
            bestMatchLength = length;
            bestMatchSection = section.title;
          }
        }
      }
    }

    if (bestMatchSection) return bestMatchSection;
    if (pathname === "/admin") return "Tổng quan";
    return "";
  };

  const [openSection, setOpenSection] = useState<string>(() =>
    findSectionByPath(location.pathname)
  );

  useEffect(() => {
    setOpenSection(findSectionByPath(location.pathname));
  }, [location.pathname]);

  const toggleSection = (sectionTitle: string) => {
    console.log("toggleSection called:", sectionTitle, "current:", openSection);
    setOpenSection((prev) => (prev === sectionTitle ? "" : sectionTitle));
  };

  const openSection_KeepOpen = (
    sectionTitle: string,
    event?: React.MouseEvent
  ) => {
    console.log(
      "openSection_KeepOpen called:",
      sectionTitle,
      "current:",
      openSection
    );
    // Ngăn event bubble lên CollapsibleTrigger
    if (event) {
      event.stopPropagation();
    }
    // Chỉ mở section, không đóng nếu đã mở
    if (openSection !== sectionTitle) {
      setOpenSection(sectionTitle);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <img src={logoImage} alt="IUH Logo" className="h-14 w-auto" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 px-3 py-4">
          {navigation.map((section) => (
            <Collapsible
              key={section.title}
              open={openSection === section.title}
              onOpenChange={(open) => {
                console.log(
                  "Collapsible onOpenChange:",
                  section.title,
                  "open:",
                  open
                );
              }}
            >
              <CollapsibleTrigger asChild>
                <button
                  onClick={() => toggleSection(section.title)}
                  className="group flex w-full items-center justify-between rounded-lg px-3 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
                >
                  <span>{section.title}</span>
                  <div className="transition-transform duration-200 group-data-[state=open]:rotate-90">
                    <ChevronRight className="size-4" />
                  </div>
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                <div className="ml-2 mt-1 space-y-1">
                  {section.items.map((item) =>
                    item.href === "/" ? (
                      // Special handling for external website link
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => openSection_KeepOpen(section.title, e)}
                        className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground text-muted-foreground"
                      >
                        <item.icon className="size-4 shrink-0" />
                        <span className="flex-1">{item.title}</span>
                      </a>
                    ) : (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === "/admin"}
                        onClick={(e) => openSection_KeepOpen(section.title, e)}
                        className={({ isActive }) =>
                          cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                              : "text-muted-foreground"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon className="size-4 shrink-0" />
                            <span className="flex-1">{item.title}</span>
                            {isActive && (
                              <ChevronRight className="size-3 shrink-0" />
                            )}
                          </>
                        )}
                      </NavLink>
                    )
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
          <p className="mt-1 text-xs font-medium">© 2025 Phòng quản trị IUH</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar({
  className,
  mobile = false,
  open,
  onOpenChange,
}: AdminSidebarProps) {
  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-full p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "w-65 border-r bg-card overflow-hidden h-screen",
        className
      )}
    >
      <SidebarContent />
    </aside>
  );
}
