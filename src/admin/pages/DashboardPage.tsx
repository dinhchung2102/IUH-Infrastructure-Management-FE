import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Users, FileText, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle as AlertCircleIcon } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, CheckCircle, XCircle } from "lucide-react";
import { getDashboardStats } from "../dashboard/api/dashboard.api";
import type {
  DashboardData,
  DashboardReport,
} from "../dashboard/types/dashboard.type";
import { getErrorMessage } from "@/lib/error-handler";
import { toast } from "sonner";
import { updateReportStatus } from "../report-management/api/report.api";
import { ReportDetailDialog } from "../report-management/components";
import type { Report } from "../report-management/types/report.type";
import { getMaintenances } from "../maintenance/api/maintenance.api";
import type { Maintenance } from "../maintenance/types/maintenance.type";

import { getReportStatusBadge, getPriorityBadge } from "@/config/badge.config";
import { Skeleton } from "@/components/ui/skeleton";

// Format time ago in Vietnamese
const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: vi,
    });
  } catch {
    return dateString;
  }
};

// Convert DashboardReport to Report type for ReportDetailDialog
const convertDashboardReportToReport = (
  dashboardReport: DashboardReport
): Report => {
  return {
    _id: dashboardReport._id,
    asset: {
      _id: dashboardReport.asset._id,
      name: dashboardReport.asset.name,
      code: dashboardReport.asset.code,
      status: dashboardReport.asset.status,
      image: dashboardReport.asset.image,
      zone: dashboardReport.asset.zone
        ? {
            _id: dashboardReport.asset.zone._id,
            name: dashboardReport.asset.zone.name,
            building: dashboardReport.asset.zone.building
              ? {
                  _id: dashboardReport.asset.zone.building._id,
                  name: dashboardReport.asset.zone.building.name,
                  campus: dashboardReport.asset.zone.building.campus
                    ? {
                        _id: dashboardReport.asset.zone.building.campus._id,
                        name: dashboardReport.asset.zone.building.campus.name,
                      }
                    : {
                        _id: "",
                        name: "",
                      },
                }
              : {
                  _id: "",
                  name: "",
                  campus: {
                    _id: "",
                    name: "",
                  },
                },
          }
        : null,
      area: dashboardReport.asset.area
        ? {
            _id: dashboardReport.asset.area._id,
            name: dashboardReport.asset.area.name,
            campus: {
              _id: "",
              name: "",
            },
          }
        : null,
    },
    type: dashboardReport.type,
    status: dashboardReport.status as "PENDING" | "APPROVED" | "REJECTED",
    priority: dashboardReport.priority,
    description: dashboardReport.description,
    images: dashboardReport.images,
    createdBy: {
      _id: dashboardReport.createdBy._id,
      fullName: dashboardReport.createdBy.fullName,
      email: dashboardReport.createdBy.email,
    },
    createdAt: dashboardReport.createdAt,
    updatedAt: dashboardReport.updatedAt,
  };
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [upcomingMaintenances, setUpcomingMaintenances] = useState<
    Maintenance[]
  >([]);
  const [loadingMaintenances, setLoadingMaintenances] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getDashboardStats();
      setData(response);
    } catch (err) {
      const errorMessage = getErrorMessage(
        err,
        "Không thể tải dữ liệu dashboard"
      );
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract nested data
  const extractData = <T,>(responseData: T | { data: T }): T => {
    if (
      responseData &&
      typeof responseData === "object" &&
      "data" in responseData
    ) {
      return (responseData as { data: T }).data;
    }
    return responseData;
  };

  useEffect(() => {
    const fetchUpcomingMaintenances = async () => {
      try {
        setLoadingMaintenances(true);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneMonthLater = new Date(today);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        const response = await getMaintenances({
          startDate: today.toISOString(),
          endDate: oneMonthLater.toISOString(),
          limit: 10,
          page: 1,
          sortBy: "scheduledDate",
          sortOrder: "asc",
        });

        if (response.success && response.data) {
          const data = extractData(response.data);
          setUpcomingMaintenances(data.maintenances || []);
        }
      } catch (err) {
        console.error("Error fetching upcoming maintenances:", err);
        // Don't show error toast for maintenance, just log it
      } finally {
        setLoadingMaintenances(false);
      }
    };

    fetchDashboardData();
    fetchUpcomingMaintenances();
  }, []);

  const handleViewDetails = (report: DashboardReport) => {
    const convertedReport = convertDashboardReportToReport(report);
    setSelectedReport(convertedReport);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (
    reportId: string,
    status: "PENDING" | "APPROVED" | "REJECTED"
  ) => {
    try {
      await updateReportStatus(reportId, status);
      toast.success("Cập nhật trạng thái thành công!");
      // Refetch dashboard data after update
      await fetchDashboardData();
    } catch (err) {
      console.error("Error updating report status:", err);
      const errorMessage = getErrorMessage(
        err,
        "Không thể cập nhật trạng thái báo cáo"
      );
      toast.error(errorMessage);
    }
  };

  const handleApproveSuccess = () => {
    fetchDashboardData();
  };

  // Stats configuration
  const statsConfig = [
    {
      title: "Tổng cơ sở vật chất",
      value: data?.stats?.totalAssets ?? 0,
      icon: Building2,
      variant: "info" as const,
      href: "/admin/asset",
      description: "Tổng số thiết bị trong hệ thống",
    },
    {
      title: "Người dùng hoạt động",
      value: data?.stats?.activeUsers ?? 0,
      icon: Users,
      variant: "success" as const,
      href: "/admin/account",
      description: "Số lượng người dùng đang hoạt động",
    },
    {
      title: "Báo cáo chờ xử lý",
      value: data?.stats?.pendingReports ?? 0,
      icon: FileText,
      variant: "warning" as const,
      href: "/admin/reports",
      description: "Báo cáo đang chờ được xử lý",
    },
    {
      title: "Phản hồi cần xử lý",
      value: data?.stats?.pendingAudits ?? 0,
      icon: AlertCircle,
      variant: "danger" as const,
      href: "/admin/audits",
      description: "Phản hồi cần được xử lý",
    },
  ];

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight uppercase">
          Tổng quan
        </h1>
        <p className="text-muted-foreground">
          Chào mừng trở lại! Đây là tổng quan về hệ thống quản lý cơ sở vật
          chất.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <Link key={stat.title} to={stat.href} className="block">
            <div className="transition-transform hover:scale-[1.02]">
              <StatsCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                description={stat.description}
                variant={stat.variant}
                isLoading={isLoading}
              />
            </div>
          </Link>
        ))}
      </div>

      {/* Charts and Tables Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Reports */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Báo cáo gần đây</CardTitle>
            <CardDescription>
              Các báo cáo mới nhất trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : data?.recentReports && data.recentReports.length > 0 ? (
              <div className="space-y-4">
                {data.recentReports.map((report) => {
                  // Get background color based on status
                  const statusBg =
                    {
                      PENDING: "bg-yellow-50",
                      APPROVED: "bg-green-50",
                      REJECTED: "bg-red-50",
                    }[
                      report.status.toUpperCase() as
                        | "PENDING"
                        | "APPROVED"
                        | "REJECTED"
                    ] || "bg-gray-50";

                  return (
                    <div
                      key={report._id}
                      className={`flex items-center justify-between rounded-lg border ${statusBg} p-3 transition-colors hover:opacity-80`}
                    >
                      <div className="space-y-1 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">
                            {report.createdBy.fullName}
                          </span>{" "}
                          đã báo cáo thông tin thiết bị{" "}
                          <span className="font-medium">
                            {report.asset.name} ({report.asset.code})
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(report.createdAt)} •{" "}
                          {report.asset.zone.name}
                          {report.asset.area && ` - ${report.asset.area.name}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.priority &&
                          getPriorityBadge(report.priority.toUpperCase())}
                        {getReportStatusBadge(
                          report.status.toUpperCase() as
                            | "PENDING"
                            | "APPROVED"
                            | "REJECTED"
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(report)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {report.status === "PENDING" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(report._id, "APPROVED")
                                  }
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Duyệt báo cáo
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUpdateStatus(report._id, "REJECTED")
                                  }
                                  className="text-destructive"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Từ chối
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Chưa có báo cáo nào
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Maintenance */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lịch bảo trì</CardTitle>
            <CardDescription>
              Kế hoạch bảo trì sắp tới (trong vòng 1 tháng)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading || loadingMaintenances ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-3 w-28" />
                  </div>
                ))}
              </div>
            ) : upcomingMaintenances.length > 0 ? (
              <div className="space-y-4">
                {upcomingMaintenances.map((maintenance) => {
                  // Get background color based on priority
                  const priorityBg =
                    {
                      CRITICAL: "bg-red-100",
                      HIGH: "bg-red-50",
                      MEDIUM: "bg-amber-50",
                      LOW: "bg-gray-50",
                    }[maintenance.priority] || "bg-gray-50";

                  return (
                    <Link
                      key={maintenance._id}
                      to="/admin/maintenance"
                      className="block"
                    >
                      <div
                        className={`rounded-lg border ${priorityBg} p-3 transition-colors hover:opacity-80 cursor-pointer`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <p className="text-sm font-medium">
                              {maintenance.asset.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {maintenance.title}
                            </p>
                          </div>
                          {getPriorityBadge(maintenance.priority)}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(maintenance.scheduledDate),
                              "dd/MM/yyyy",
                              { locale: vi }
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Không có lịch bảo trì sắp tới
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Detail Dialog */}
      <ReportDetailDialog
        report={selectedReport}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onApproveSuccess={handleApproveSuccess}
      />
    </div>
  );
}
