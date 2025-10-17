import { useState } from "react";
import {
  StaffTable,
  StaffStatsCards,
  StaffStatsDialog,
  AddStaffDialog,
} from "../components";
import PaginationComponent from "@/components/PaginationComponent";
import { useStaffManagement, useStaffStats } from "../hooks";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { ChartBar, UserPlus } from "lucide-react";

export default function StaffPage() {
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
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddSuccess = () => {
    refetch(); // Refresh danh sách nhân sự
    refetchStats(); // Refresh thống kê
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
            onClick={() => setIsStatsDialogOpen(true)}
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

      <StaffStatsDialog
        open={isStatsDialogOpen}
        onOpenChange={setIsStatsDialogOpen}
      />

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
      />

      <PaginationComponent
        pagination={pagination}
        currentPage={paginationRequest.page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
