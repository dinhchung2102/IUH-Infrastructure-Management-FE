import { useState } from "react";
import { StaffTable, StaffStatsCards, AddStaffDialog, StaffDetailDialog } from "../components";
import PaginationComponent from "@/components/PaginationComponent";
import { useStaffManagement, useStaffStats } from "../hooks";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { ChartBar, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getStaffById } from "../api/staff-actions.api";
import type { StaffResponse } from "../types/staff.type";
import { toast } from "sonner";

export default function StaffPage() {
  const navigate = useNavigate();
  const {
    staff,
    loading,
    filters,
    pagination,
    paginationRequest,
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
    updateStaffStatus,
    refetch,
  } = useStaffManagement();

  const {
    stats,
    loading: statsLoading,
    refetch: refetchStats,
  } = useStaffStats();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleAddSuccess = () => {
    refetch(); // Refresh danh sách nhân sự
    refetchStats(); // Refresh thống kê
  };

  const handleViewDetails = async (staffId: string) => {
    try {
      setDetailLoading(true);
      setDetailDialogOpen(true);
      const response = await getStaffById(staffId);
      if (response.success && response.data) {
        // Handle nested structure: response.data.account or response.data
        const staffData = (response.data as any).account || response.data;
        setSelectedStaff(staffData);
      } else {
        toast.error("Không thể tải thông tin nhân viên");
        setDetailDialogOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết nhân viên:", error);
      toast.error("Không thể tải thông tin nhân viên");
      setDetailDialogOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/staff" },
            { label: "Quản lý nhân sự", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => navigate("/admin/statistics/staff")}
          >
            <ChartBar className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Thêm nhân sự
          </Button>
        </div>
      </div>

      <StaffStatsCards stats={stats} loading={statsLoading} />

      <AddStaffDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={handleAddSuccess}
      />

      <StaffTable
        staff={staff}
        loading={loading}
        paginationRequest={paginationRequest}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onStaffStatusUpdate={updateStaffStatus}
        onViewDetails={handleViewDetails}
      />

      <PaginationComponent
        pagination={pagination}
        currentPage={paginationRequest.page}
        onPageChange={handlePageChange}
      />

      <StaffDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        staff={selectedStaff}
        loading={detailLoading}
      />
    </div>
  );
}
