import { StatsCard } from "@/components/StatsCard";
import { LayoutGrid, CheckCircle2, XCircle, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface ZoneStats {
  totalZones: number;
  activeZones: number;
  inactiveZones: number;
  newZonesThisMonth: number;
}

interface ZoneStatsCardsProps {
  stats?: ZoneStats;
  loading?: boolean;
}

export function ZoneStatsCards({ stats, loading }: ZoneStatsCardsProps) {
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
        title="Tổng số khu vực"
        value={stats?.totalZones || 0}
        icon={LayoutGrid}
        description="Tổng số khu vực trong hệ thống"
        variant="default"
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.activeZones || 0}
        icon={CheckCircle2}
        description="Khu vực đang hoạt động"
        variant="success"
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.inactiveZones || 0}
        icon={XCircle}
        description="Khu vực ngừng hoạt động"
        variant="danger"
      />
      <StatsCard
        title="Khu vực mới trong tháng"
        value={stats?.newZonesThisMonth || 0}
        icon={PlusCircle}
        description="Khu vực mới trong tháng"
        variant="info"
      />
    </div>
  );
}
