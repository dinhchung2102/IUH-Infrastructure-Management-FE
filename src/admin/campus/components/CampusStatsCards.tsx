import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CampusStats {
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
        title="Tổng số cơ sở"
        value={stats?.totalCampus || 0}
        icon={Building2}
        description="Tổng số cơ sở trong hệ thống"
        variant="default"
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.activeCampus || 0}
        icon={CheckCircle2}
        description="Cơ sở đang hoạt động"
        variant="success"
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.inactiveCampus || 0}
        icon={XCircle}
        description="Cơ sở ngừng hoạt động"
        variant="danger"
      />
      <StatsCard
        title="Cơ sở mới tháng này"
        value={stats?.newCampusThisMonth || 0}
        icon={PlusCircle}
        description="Cơ sở mới trong tháng"
        variant="info"
      />
    </div>
  );
}
