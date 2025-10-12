import { AccountTable } from "../components";
import PaginationComponent from "@/components/PaginationComponent";
import { useAccountManagement } from "../hooks";

export default function AccountPage() {
  const {
    accounts,
    loading,
    filters,
    pagination,
    paginationRequest,
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
  } = useAccountManagement();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">
          Quản lý tài khoản
        </h2>
        <p className="text-muted-foreground">
          Quản lý và theo dõi tất cả tài khoản trong hệ thống
        </p>
      </div>

      <AccountTable
        accounts={accounts}
        loading={loading}
        paginationRequest={paginationRequest}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
      />

      <PaginationComponent
        pagination={pagination}
        currentPage={paginationRequest.page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
