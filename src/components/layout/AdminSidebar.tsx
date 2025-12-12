import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Settings,
  BarChart3,
  Calendar,
  ChevronRight,
  Globe,
  Map,
  Home,
  User,
  Wrench,
  Shield,
  Newspaper,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { usePermission } from "@/hooks/use-permission";
import { Resource, Permission } from "@/types/permission.type";
import logoImage from "@/assets/logo/iuh_logo-official.png";

interface AdminSidebarProps {
  className?: string;
  mobile?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// ------------------ NAVIGATION DATA ------------------
interface NavigationItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  resource?: Resource;
  action?: Permission;
  // If true, always show (e.g., dashboard, settings)
  alwaysShow?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const navigation: NavigationSection[] = [
  {
    title: "Tổng quan",
    items: [
      {
        title: "Tổng quan hệ thống",
        href: "/admin",
        icon: LayoutDashboard,
        alwaysShow: true, // Dashboard always visible for admin users
      },
      {
        title: "Thống kê cơ bản",
        href: "/admin/analytics",
        icon: BarChart3,
        // Statistics can be viewed by anyone with READ permission on any resource
      },
    ],
  },
  {
    title: "Quản lý",
    items: [
      {
        title: "Cơ sở & Khu vực",
        icon: Building2,
        children: [
          {
            title: "Quản lý cơ sở",
            href: "/admin/campus",
            icon: Home,
            resource: Resource.CAMPUS,
            action: Permission.READ,
          },
          {
            title: "Quản lý tòa nhà",
            href: "/admin/buildings",
            icon: Building2,
            resource: Resource.BUILDING,
            action: Permission.READ,
          },
          {
            title: "Khu vực ngoài trời",
            href: "/admin/areas",
            icon: Map,
            resource: Resource.AREA,
            action: Permission.READ,
          },
          {
            title: "Phòng & Khu vực",
            href: "/admin/zone",
            icon: Map,
            resource: Resource.ZONE,
            action: Permission.READ,
          },
        ],
      },
      {
        title: "Tài khoản",
        href: "/admin/account",
        icon: User,
        resource: Resource.ACCOUNT,
        action: Permission.READ,
      },
      {
        title: "Nhân sự",
        href: "/admin/staff",
        icon: Users,
        resource: Resource.ACCOUNT,
        action: Permission.READ,
      },
      {
        title: "Báo cáo",
        href: "/admin/reports",
        icon: FileText,
        resource: Resource.REPORT,
        action: Permission.READ,
      },
      {
        title: "Nhiệm vụ",
        href: "/admin/audits",
        icon: Wrench,
        resource: Resource.AUDIT,
        action: Permission.READ,
      },
      {
        title: "Phân quyền",
        href: "/admin/roles",
        icon: Shield,
        resource: Resource.ROLE,
        action: Permission.READ,
      },
      {
        title: "Tin tức",
        icon: Newspaper,
        children: [
          {
            title: "Quản lý tin tức",
            href: "/admin/news",
            icon: Newspaper,
            resource: Resource.NEWS,
            action: Permission.READ,
          },
          {
            title: "Danh mục tin tức",
            href: "/admin/news-categories",
            icon: FolderOpen,
            resource: Resource.NEWS_CATEGORY,
            action: Permission.READ,
          },
        ],
      },
      {
        title: "Thiết bị",
        icon: Building2,
        children: [
          {
            title: "Danh mục thiết bị",
            href: "/admin/asset-categories",
            icon: Home,
            resource: Resource.ASSET_CATEGORY,
            action: Permission.READ,
          },
          {
            title: "Quản lý thiết bị",
            href: "/admin/asset",
            icon: Map,
            resource: Resource.ASSET,
            action: Permission.READ,
          },
        ],
      },
    ],
  },
  {
    title: "Báo cáo & Thống kê",
    items: [
      {
        title: "Thống kê báo cáo",
        href: "/admin/reports/statistics",
        icon: FileText,
        resource: Resource.REPORT,
        action: Permission.READ,
      },
      {
        title: "Thống kê tài khoản",
        href: "/admin/statistics/account",
        icon: User,
        resource: Resource.ACCOUNT,
        action: Permission.READ,
      },
      {
        title: "Thống kê nhân sự",
        href: "/admin/statistics/staff",
        icon: Users,
        resource: Resource.ACCOUNT,
        action: Permission.READ,
      },
      {
        title: "Thống kê nhiệm vụ",
        href: "/admin/statistics/audit",
        icon: Wrench,
        resource: Resource.AUDIT,
        action: Permission.READ,
      },
      {
        title: "Thống kê Tòa nhà & Khu vực",
        href: "/admin/statistics/building-area",
        icon: Building2,
        resource: Resource.BUILDING,
        action: Permission.READ,
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
        resource: Resource.MAINTENANCE,
        action: Permission.READ,
      },
      {
        title: "Cài đặt",
        href: "/admin/settings",
        icon: Settings,
        alwaysShow: true, // Settings always visible
      },
      {
        title: "Xem website",
        href: "/",
        icon: Globe,
        alwaysShow: true, // Always allow to view website
      },
    ],
  },
];

// ------------------ HELPER FUNCTIONS ------------------
/**
 * Filter navigation items based on user permissions
 */
function useFilteredNavigation(navData: NavigationSection[]) {
  const { hasPermission, hasResourcePermission } = usePermission();

  return useMemo(() => {
    return navData
      .map((section) => ({
        ...section,
        items: section.items
          .map((item) => {
            // If alwaysShow is true, include item
            if (item.alwaysShow) {
              return item;
            }

            // If item has resource and action, check permission
            if (item.resource && item.action) {
              const hasAccess = hasPermission(item.resource, item.action);
              if (!hasAccess) {
                return null;
              }
            } else if (item.resource) {
              // If only resource specified, check if user has any permission for that resource
              const hasAccess = hasResourcePermission(item.resource);
              if (!hasAccess) {
                return null;
              }
            }

            // Filter children if they exist
            if (item.children) {
              const filteredChildren = item.children.filter((child) => {
                if (child.alwaysShow) {
                  return true;
                }
                if (child.resource && child.action) {
                  return hasPermission(child.resource, child.action);
                }
                if (child.resource) {
                  return hasResourcePermission(child.resource);
                }
                return true;
              });

              // Only include parent if it has at least one visible child
              if (filteredChildren.length === 0) {
                return null;
              }

              return {
                ...item,
                children: filteredChildren,
              };
            }

            return item;
          })
          .filter((item): item is NavigationItem => item !== null),
      }))
      .filter((section) => section.items.length > 0);
  }, [navData, hasPermission, hasResourcePermission]);
}

// ------------------ SIDEBAR CONTENT ------------------
function SidebarContent() {
  const location = useLocation();
  const filteredNavigation = useFilteredNavigation(navigation);

  const findSectionByPath = useCallback(
    (pathname: string): string => {
      let bestMatchSection = "";
      let bestMatchLength = -1;

      for (const section of filteredNavigation) {
        for (const item of section.items) {
          if (item.href === "/") continue;

          if (pathname === item.href) {
            const length = item.href.length;
            if (length > bestMatchLength) {
              bestMatchLength = length;
              bestMatchSection = section.title;
            }
            continue;
          }

          if (item.href && pathname.startsWith(item.href + "/")) {
            const length = item.href.length;
            if (length > bestMatchLength) {
              bestMatchLength = length;
              bestMatchSection = section.title;
            }
          }

          // Check nested children
          if (item.children) {
            for (const child of item.children) {
              if (child.href && pathname.startsWith(child.href)) {
                bestMatchSection = section.title;
              }
            }
          }
        }
      }

      if (bestMatchSection) return bestMatchSection;
      if (pathname === "/admin") return "Tổng quan";
      return "";
    },
    [filteredNavigation]
  );

  const [openSection, setOpenSection] = useState<string>(() =>
    findSectionByPath(location.pathname)
  );

  useEffect(() => {
    setOpenSection(findSectionByPath(location.pathname));
  }, [location.pathname, findSectionByPath]);

  const toggleSection = (sectionTitle: string) => {
    setOpenSection((prev) => (prev === sectionTitle ? "" : sectionTitle));
  };

  const openSection_KeepOpen = (
    sectionTitle: string,
    event?: React.MouseEvent
  ) => {
    if (event) event.stopPropagation();
    if (openSection !== sectionTitle) {
      setOpenSection(sectionTitle);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-3">
        <img src={logoImage} alt="IUH Logo" className="w-full h-auto" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2 px-3 py-4">
          {filteredNavigation.map((section) => (
            <Collapsible
              key={section.title}
              open={openSection === section.title}
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
                  {section.items.map((item) => {
                    // Nếu có menu con
                    if (item.children) {
                      // Xác định nếu route hiện tại nằm trong các child => active = true
                      const isActive = item.children.some(
                        (child) =>
                          child.href && location.pathname.startsWith(child.href)
                      );

                      return (
                        <Collapsible key={item.title} defaultOpen={isActive}>
                          <CollapsibleTrigger asChild>
                            <button
                              onClick={(e) =>
                                openSection_KeepOpen(section.title, e)
                              }
                              className={cn(
                                "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <item.icon className="size-4 shrink-0" />
                                <span>{item.title}</span>
                              </div>
                              <ChevronRight
                                className={cn(
                                  "size-3 transition-transform",
                                  isActive && "rotate-90"
                                )}
                              />
                            </button>
                          </CollapsibleTrigger>

                          <CollapsibleContent className="ml-6 mt-1 space-y-1">
                            {item.children
                              .filter((child) => child.href)
                              .map((child) => (
                                <NavLink
                                  key={child.href}
                                  to={child.href!}
                                  onClick={(e) =>
                                    openSection_KeepOpen(section.title, e)
                                  }
                                  className={({ isActive }) =>
                                    cn(
                                      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-all",
                                      isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    )
                                  }
                                >
                                  <child.icon className="size-4 shrink-0" />
                                  {child.title}
                                </NavLink>
                              ))}
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    }

                    // Nếu không có menu con
                    if (!item.href) return null;

                    return item.href === "/" ? (
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
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            Version {import.meta.env.VITE_APP_VERSION || "1.0.0"}
          </p>
          <p className="mt-1 text-xs font-medium">
            © {new Date().getFullYear()} Phòng quản trị IUH
          </p>
        </div>
      </div>
    </div>
  );
}

// ------------------ MAIN SIDEBAR ------------------
export default function AdminSidebar({
  className,
  mobile = false,
  open,
  onOpenChange,
}: AdminSidebarProps) {
  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-[280px] max-w-[85vw] p-0">
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
