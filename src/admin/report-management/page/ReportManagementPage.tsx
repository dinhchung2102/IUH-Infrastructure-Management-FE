import { useState, useEffect } from "react";
import {
  ReportStatsCards,
  ReportFilters,
  ReportTable,
  ReportDetailDialog,
  ReportStatsDialog,
} from "../components";
import type {
  Report,
  ReportStatus,
  ReportFilters as Filters,
} from "../types/report.type";
import { toast } from "sonner";
import PaginationComponent from "@/components/PaginationComponent";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { ChartBar } from "lucide-react";
import {
  getReports,
  updateReportStatus,
  getReportStats,
  transformReportApiToUI,
} from "../api/report.api";
import { TableSkeleton } from "@/components/TableSkeleton";
import type { PaginationResponse } from "@/types/pagination.type";

export default function ReportManagementPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationResponse>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // Filters
  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "all",
    type: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    todayReports: 0,
    reportsThisMonth: 0,
    reportsLastMonth: 0,
    averageResolutionTime: 0,
  });

  // Fetch reports từ API
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReports({
        page: currentPage,
        limit: 10,
        search: filters.search || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        type: filters.type !== "all" ? filters.type : undefined,
        dateFrom: filters.dateFrom || undefined,
        dateTo: filters.dateTo || undefined,
      });

      if (response.success && response.data) {
        // Transform API data sang UI format và filter out null values
        const transformedReports = response.data.reports
          .map(transformReportApiToUI)
          .filter((report): report is Report => report !== null);
        setReports(transformedReports);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Không thể tải danh sách báo cáo");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats từ API
  const fetchStats = async () => {
    try {
      const response = await getReportStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch reports khi component mount hoặc khi filters/page thay đổi
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  // Fetch stats khi component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      type: "all",
      dateFrom: "",
      dateTo: "",
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (reportId: string, status: ReportStatus) => {
    try {
      await updateReportStatus(reportId, status);
      toast.success("Cập nhật trạng thái thành công!");
      // Refetch reports sau khi cập nhật
      fetchReports();
    } catch (error) {
      console.error("Error updating report status:", error);
      toast.error("Không thể cập nhật trạng thái báo cáo");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/reports" },
            { label: "Quản lý báo cáo", isCurrent: true },
          ]}
        />
        <Button
          className="w-full cursor-pointer md:w-auto"
          onClick={() => setIsStatsDialogOpen(true)}
        >
          <ChartBar className="h-4 w-4" />
          Xem thống kê
        </Button>
      </div>

      {/* Stats Cards */}
      <ReportStatsCards stats={stats} />

      {/* Filters */}
      <ReportFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <div className="space-y-4">
        {loading ? (
          <TableSkeleton
            rows={5}
            columns={[
              { type: "number", width: "w-[60px]", align: "center" },
              { type: "text", width: "w-[180px]" },
              { type: "avatar", width: "w-[200px]" },
              { type: "text", width: "w-[150px]" },
              { type: "badge", width: "w-[100px]" },
              { type: "badge", width: "w-[100px]" },
              { type: "badge", width: "w-[100px]" },
              { type: "text", width: "w-[120px]" },
              { type: "text", width: "w-[80px]", align: "right" },
            ]}
          />
        ) : (
          <ReportTable
            reports={reports}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            currentPage={currentPage}
            itemsPerPage={pagination.itemsPerPage}
          />
        )}

        {pagination.totalPages > 1 && (
          <PaginationComponent
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Detail Dialog */}
      <ReportDetailDialog
        report={selectedReport}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onApproveSuccess={fetchReports}
      />

      {/* Stats Dialog */}
      <ReportStatsDialog
        open={isStatsDialogOpen}
        onOpenChange={setIsStatsDialogOpen}
      />
    </div>
  );
}
