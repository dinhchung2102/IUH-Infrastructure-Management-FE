import { StatsCard } from "@/components/StatsCard";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import type { AccountStatistics } from "../api/account-stats.api";

interface AccountStatsCardsProps {
  stats: AccountStatistics | null;
  loading: boolean;
}

export function AccountStatsCards({ stats, loading }: AccountStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng tài khoản"
        value={stats?.totalAccounts || 0}
        icon={Users}
        description="Tổng số tài khoản trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.activeAccounts || 0}
        icon={UserCheck}
        description="Tài khoản đang hoạt động"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Không hoạt động"
        value={stats?.inactiveAccounts || 0}
        icon={UserX}
        description="Tài khoản bị vô hiệu hóa"
        variant="warning"
        isLoading={loading}
      />
      <StatsCard
        title="Mới tháng này"
        value={stats?.newAccountsThisMonth || 0}
        icon={UserPlus}
        description="Tài khoản đăng ký trong tháng"
        variant="info"
        isLoading={loading}
      />
    </div>
  );
}
