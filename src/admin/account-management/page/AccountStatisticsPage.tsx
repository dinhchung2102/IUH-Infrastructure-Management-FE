import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { AccountStatsDialogTabs } from "../components/AccountStatsDialogTabs";
import { useAccountStatsDialog } from "../hooks";

export default function AccountStatisticsPage() {
  const { stats, loading, timeType, setTimeType, activeRole, setActiveRole } =
    useAccountStatsDialog({ open: true });

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Báo cáo & Thống kê", href: "/admin/reports/statistics" },
          { label: "Thống kê tài khoản", isCurrent: true },
        ]}
      />
      <AccountStatsDialogTabs
        stats={stats}
        loading={loading}
        timeType={timeType}
        setTimeType={setTimeType}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
      />
    </div>
  );
}
