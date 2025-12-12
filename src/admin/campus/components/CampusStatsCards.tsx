import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, PlusCircle } from "lucide-react";

export interface CampusStats {
  totalCampus: number;
  activeCampus: number;
  inactiveCampus: number;
  newCampusThisMonth: number;
}

interface CampusStatsCardsProps {
  stats?: CampusStats;
  loading?: boolean;
}

export function CampusStatsCards({ stats, loading }: CampusStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng số cơ sở"
        value={stats?.totalCampus || 0}
        icon={Building2}
        description="Tổng số cơ sở trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.activeCampus || 0}
        icon={CheckCircle2}
        description="Cơ sở đang hoạt động"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.inactiveCampus || 0}
        icon={XCircle}
        description="Cơ sở ngừng hoạt động"
        variant="danger"
        isLoading={loading}
      />
      <StatsCard
        title="Cơ sở mới tháng này"
        value={stats?.newCampusThisMonth || 0}
        icon={PlusCircle}
        description="Cơ sở mới trong tháng"
        variant="info"
        isLoading={loading}
      />
    </div>
  );
}
