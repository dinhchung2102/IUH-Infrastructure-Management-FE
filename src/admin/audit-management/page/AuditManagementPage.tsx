import { useState, useEffect } from "react";
import {
  AuditStatsCards,
  AuditFilters,
  AuditTable,
  AuditDetailDialog,
} from "../components";
import type {
  AuditLog,
  AuditStatus,
  AuditFilters as Filters,
} from "../types/audit.type";
import { toast } from "sonner";
import PaginationComponent from "@/components/PaginationComponent";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  getAuditLogs,
  updateAuditStatus,
  getAuditStats,
  transformAuditLogApiToUI,
} from "../api/audit.api";
import { TableSkeleton } from "@/components/TableSkeleton";
import type { PaginationResponse } from "@/types/pagination.type";

export default function AuditManagementPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
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
    campus: "all",
    zone: "all",
    startDate: "",
    endDate: "",
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    todayAudits: 0,
  });

  // Fetch audit logs từ API
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await getAuditLogs({
        page: currentPage,
        limit: 10,
        search: filters.search || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        campus: filters.campus !== "all" ? filters.campus : undefined,
        zone: filters.zone !== "all" ? filters.zone : undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });

      if (response.success && response.data) {
        const transformedLogs = response.data.auditLogs.map(
          transformAuditLogApiToUI
        );
        setAuditLogs(transformedLogs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast.error("Không thể tải danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats từ API
  const fetchStats = async () => {
    try {
      const response = await getAuditStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch audit logs khi component mount hoặc khi filters/page thay đổi
  useEffect(() => {
    fetchAuditLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  // Fetch stats khi component mount
  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "all",
      campus: "all",
      zone: "all",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (audit: AuditLog) => {
    setSelectedAudit(audit);
    setDetailDialogOpen(true);
  };

  const handleUpdateStatus = async (auditId: string, status: AuditStatus) => {
    try {
      await updateAuditStatus(auditId, status);
      toast.success("Cập nhật trạng thái thành công!");
      fetchAuditLogs();
    } catch (error) {
      console.error("Error updating audit status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/audits" },
            { label: "Bảo trì & Sửa chữa", isCurrent: true },
          ]}
        />
      </div>

      {/* Stats Cards */}
      <AuditStatsCards stats={stats} />

      {/* Filters */}
      <AuditFilters
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
              { type: "text", width: "w-[200px]" },
              { type: "avatar", width: "w-[200px]" },
              { type: "text", width: "w-[150px]" },
              { type: "badge", width: "w-[100px]" },
              { type: "text", width: "w-[150px]" },
              { type: "badge", width: "w-[100px]" },
              { type: "text", width: "w-[120px]" },
              { type: "text", width: "w-[80px]", align: "right" },
            ]}
          />
        ) : (
          <AuditTable
            auditLogs={auditLogs}
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
      <AuditDetailDialog
        audit={selectedAudit}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
    </div>
  );
}
