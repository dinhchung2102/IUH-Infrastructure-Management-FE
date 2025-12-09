import { useState } from "react";
import { AccountTable, AccountStatsCards, AccountDetailDialog } from "../components";
import PaginationComponent from "@/components/PaginationComponent";
import { useAccountManagement, useAccountStats } from "../hooks";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { ChartBar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAccountById } from "../api/account-actions.api";
import type { AccountResponse } from "../types/account.type";
import { toast } from "sonner";

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
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const handleViewDetails = async (accountId: string) => {
    try {
      setDetailLoading(true);
      setDetailDialogOpen(true);
      const response = await getAccountById(accountId);
      if (response.success && response.data) {
        // Handle nested structure: response.data.account or response.data
        const accountData = (response.data as any).account || response.data;
        setSelectedAccount(accountData);
      } else {
        toast.error("Không thể tải thông tin tài khoản");
        setDetailDialogOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi tải chi tiết tài khoản:", error);
      toast.error("Không thể tải thông tin tài khoản");
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
        onViewDetails={handleViewDetails}
      />

      <PaginationComponent
        pagination={pagination}
        currentPage={paginationRequest.page}
        onPageChange={handlePageChange}
      />

      <AccountDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        account={selectedAccount}
        loading={detailLoading}
      />
    </div>
  );
}
