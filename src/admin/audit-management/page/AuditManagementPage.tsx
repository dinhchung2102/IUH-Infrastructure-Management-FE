import { useState, useEffect } from "react";
import {
  AuditStatsCards,
  AuditFilters,
  AuditTable,
  AuditDetailDialog,
  CreateAuditDialog,
  CancelAuditDialog,
} from "../components";
import type {
  AuditLog,
  AuditStatus,
  AuditFilters as Filters,
} from "../types/audit.type";
import { toast } from "sonner";
import PaginationComponent from "@/components/PaginationComponent";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Button } from "@/components/ui/button";
import { Plus, ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getAuditLogs,
  updateAuditStatus,
  getAuditStats,
  transformAuditLogApiToUI,
} from "../api/audit.api";
import type { PaginationResponse } from "@/types/pagination.type";

export default function AuditManagementPage() {
  const navigate = useNavigate();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [auditToCancel, setAuditToCancel] = useState<AuditLog | null>(null);
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
      fetchStats();
    } catch (error) {
      console.error("Error updating audit status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleCancelClick = (audit: AuditLog) => {
    setAuditToCancel(audit);
    setCancelDialogOpen(true);
  };

  const handleCancelSuccess = () => {
    fetchAuditLogs();
    fetchStats();
    // Close detail dialog if it was open
    if (detailDialogOpen) {
      setDetailDialogOpen(false);
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
            { label: "Nhiệm vụ", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => navigate("/admin/statistics/audit")}
          >
            <ChartBar className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Tạo nhiệm vụ
          </Button>
        </div>
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
      <AuditTable
        auditLogs={auditLogs}
        onViewDetails={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        onCancel={handleCancelClick}
        currentPage={currentPage}
        itemsPerPage={pagination.itemsPerPage}
        loading={loading}
      />

      {pagination.totalPages > 1 && (
        <PaginationComponent
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Detail Dialog */}
      <AuditDetailDialog
        audit={selectedAudit}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onCancel={handleCancelClick}
      />

      {/* Cancel Dialog */}
      <CancelAuditDialog
        audit={auditToCancel}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onCancelSuccess={handleCancelSuccess}
      />{/* Create Audit Dialog */}
      <CreateAuditDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={fetchAuditLogs}
      />
    </div>
  );
}
