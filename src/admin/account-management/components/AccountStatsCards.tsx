import { StatsCard } from "@/components/StatsCard";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AccountStatistics } from "../api/account-stats.api";

interface AccountStatsCardsProps {
  stats: AccountStatistics | null;
  loading: boolean;
}

export function AccountStatsCards({ stats, loading }: AccountStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng tài khoản"
        value={stats?.totalAccounts || 0}
        icon={Users}
        description="Tổng số tài khoản trong hệ thống"
        variant="default"
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.activeAccounts || 0}
        icon={UserCheck}
        description="Tài khoản đang hoạt động"
        variant="success"
      />
      <StatsCard
        title="Không hoạt động"
        value={stats?.inactiveAccounts || 0}
        icon={UserX}
        description="Tài khoản bị vô hiệu hóa"
        variant="warning"
      />
      <StatsCard
        title="Mới tháng này"
        value={stats?.newAccountsThisMonth || 0}
        icon={UserPlus}
        description="Tài khoản đăng ký trong tháng"
        variant="info"
      />
    </div>
  );
}
