import { AccountTable, AccountStatsCards } from "../components";
import PaginationComponent from "@/components/PaginationComponent";
import { useAccountManagement, useAccountStats } from "../hooks";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const navigate = useNavigate();
  const {
    accounts,
    loading,
    filters,
    pagination,
    paginationRequest,
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
    updateAccountStatus,
  } = useAccountManagement();

  const { stats, loading: statsLoading } = useAccountStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/account" },
            { label: "Quản lý tài khoản", isCurrent: true },
          ]}
        />
        <Button
          className="w-full cursor-pointer md:w-auto"
          onClick={() => navigate("/admin/statistics/account")}
        >
          <ChartBar className="h-4 w-4" />
          Xem thống kê
        </Button>
      </div>

      <AccountStatsCards stats={stats} loading={statsLoading} />

      <AccountTable
        accounts={accounts}
        loading={loading}
        paginationRequest={paginationRequest}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        onAccountStatusUpdate={updateAccountStatus}
      />

      <PaginationComponent
        pagination={pagination}
        currentPage={paginationRequest.page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
