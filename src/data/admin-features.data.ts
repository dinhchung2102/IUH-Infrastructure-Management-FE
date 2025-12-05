import {
  LayoutDashboard,
  BarChart3,
  Home,
  Map,
  User,
  Users,
  FileText,
  Wrench,
  Shield,
  Newspaper,
  FolderOpen,
  Building2,
  Calendar,
  Settings,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminFeature {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  category: string;
  keywords: string[]; // For search
}

// All admin features data - Easy to customize
export const adminFeatures: AdminFeature[] = [
  // Tổng quan
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Tổng quan hệ thống và thống kê",
    href: "/admin",
    icon: LayoutDashboard,
    category: "Tổng quan",
    keywords: ["dashboard", "tổng quan", "trang chủ", "home"],
  },
  {
    id: "analytics",
    title: "Thống kê",
    description: "Phân tích và thống kê chi tiết",
    href: "/admin/analytics",
    icon: BarChart3,
    category: "Tổng quan",
    keywords: ["thống kê", "analytics", "phân tích", "biểu đồ", "chart"],
  },

  // Quản lý cơ sở & Khu vực
  {
    id: "campus",
    title: "Quản lý cơ sở",
    description: "Quản lý các cơ sở của trường",
    href: "/admin/campus",
    icon: Home,
    category: "Cơ sở & Khu vực",
    keywords: ["cơ sở", "campus", "trường", "building"],
  },
  {
    id: "building-area",
    title: "Quản lý khu vực",
    description: "Quản lý các khu vực và tòa nhà",
    href: "/admin/building-area",
    icon: Map,
    category: "Cơ sở & Khu vực",
    keywords: ["khu vực", "building", "area", "tòa nhà"],
  },
  {
    id: "zone",
    title: "Quản lý phòng",
    description: "Quản lý các phòng và không gian",
    href: "/admin/zone",
    icon: Map,
    category: "Cơ sở & Khu vực",
    keywords: ["phòng", "zone", "room", "không gian"],
  },

  // Quản lý người dùng
  {
    id: "account",
    title: "Tài khoản",
    description: "Quản lý tài khoản người dùng",
    href: "/admin/account",
    icon: User,
    category: "Quản lý người dùng",
    keywords: ["tài khoản", "account", "user", "người dùng"],
  },
  {
    id: "staff",
    title: "Nhân sự",
    description: "Quản lý nhân sự và nhân viên",
    href: "/admin/staff",
    icon: Users,
    category: "Quản lý người dùng",
    keywords: ["nhân sự", "staff", "nhân viên", "employee"],
  },

  // Quản lý báo cáo & Kiểm tra
  {
    id: "reports",
    title: "Báo cáo",
    description: "Quản lý các báo cáo sự cố",
    href: "/admin/reports",
    icon: FileText,
    category: "Báo cáo & Kiểm tra",
    keywords: ["báo cáo", "report", "sự cố", "issue"],
  },
  {
    id: "audits",
    title: "Nhiệm vụ",
    description: "Quản lý kiểm tra và bảo trì",
    href: "/admin/audits",
    icon: Wrench,
    category: "Báo cáo & Kiểm tra",
    keywords: ["bảo trì", "audit", "kiểm tra", "maintenance", "sửa chữa"],
  },

  // Phân quyền
  {
    id: "roles",
    title: "Phân quyền",
    description: "Quản lý vai trò và quyền hạn",
    href: "/admin/roles",
    icon: Shield,
    category: "Phân quyền",
    keywords: ["phân quyền", "role", "permission", "quyền", "vai trò"],
  },

  // Quản lý tin tức
  {
    id: "news",
    title: "Quản lý tin tức",
    description: "Quản lý các bài viết tin tức",
    href: "/admin/news",
    icon: Newspaper,
    category: "Tin tức",
    keywords: ["tin tức", "news", "bài viết", "article"],
  },
  {
    id: "news-categories",
    title: "Danh mục tin tức",
    description: "Quản lý danh mục tin tức",
    href: "/admin/news-categories",
    icon: FolderOpen,
    category: "Tin tức",
    keywords: ["danh mục", "category", "news category"],
  },

  // Quản lý thiết bị
  {
    id: "asset-categories",
    title: "Danh mục thiết bị",
    description: "Quản lý danh mục thiết bị",
    href: "/admin/asset-categories",
    icon: FolderOpen,
    category: "Thiết bị",
    keywords: ["danh mục thiết bị", "asset category", "loại thiết bị"],
  },
  {
    id: "asset",
    title: "Quản lý thiết bị",
    description: "Quản lý tài sản và thiết bị",
    href: "/admin/asset",
    icon: Building2,
    category: "Thiết bị",
    keywords: ["thiết bị", "asset", "tài sản", "equipment"],
  },

  // Hệ thống
  {
    id: "maintenance",
    title: "Lịch bảo trì",
    description: "Quản lý lịch bảo trì định kỳ",
    href: "/admin/maintenance",
    icon: Calendar,
    category: "Hệ thống",
    keywords: ["lịch bảo trì", "maintenance", "schedule", "lịch"],
  },
  {
    id: "settings",
    title: "Cài đặt",
    description: "Cấu hình hệ thống",
    href: "/admin/settings",
    icon: Settings,
    category: "Hệ thống",
    keywords: ["cài đặt", "settings", "config", "cấu hình"],
  },
  {
    id: "home",
    title: "Xem website",
    description: "Quay về trang chủ công khai",
    href: "/",
    icon: Globe,
    category: "Hệ thống",
    keywords: ["website", "trang chủ", "home", "public"],
  },
];

// Helper function to search features
export const searchFeatures = (query: string): AdminFeature[] => {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase().trim();

  return adminFeatures.filter((feature) => {
    const titleMatch = feature.title.toLowerCase().includes(lowerQuery);
    const descriptionMatch = feature.description
      ?.toLowerCase()
      .includes(lowerQuery);
    const keywordMatch = feature.keywords.some((keyword) =>
      keyword.toLowerCase().includes(lowerQuery)
    );
    const categoryMatch = feature.category.toLowerCase().includes(lowerQuery);

    return titleMatch || descriptionMatch || keywordMatch || categoryMatch;
  });
};

// Get features by category
export const getFeaturesByCategory = (): Record<string, AdminFeature[]> => {
  return adminFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, AdminFeature[]>);
};
