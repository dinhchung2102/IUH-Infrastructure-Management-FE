import { StatsCard } from "@/components/StatsCard";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import type { StaffStatistics } from "../api/staff-stats.api";

interface StaffStatsCardsProps {
  stats: StaffStatistics | null;
  loading: boolean;
}

export function StaffStatsCards({ stats, loading }: StaffStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng nhân sự"
        value={stats?.totalAccounts || 0}
        icon={Users}
        description="Tổng số nhân sự trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.activeAccounts || 0}
        icon={UserCheck}
        description="Nhân sự đang hoạt động"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Không hoạt động"
        value={stats?.inactiveAccounts || 0}
        icon={UserX}
        description="Nhân sự bị vô hiệu hóa"
        variant="warning"
        isLoading={loading}
      />
      <StatsCard
        title="Mới tháng này"
        value={stats?.newAccountsThisMonth || 0}
        icon={UserPlus}
        description="Nhân sự mới trong tháng"
        variant="info"
        isLoading={loading}
      />
    </div>
  );
}
