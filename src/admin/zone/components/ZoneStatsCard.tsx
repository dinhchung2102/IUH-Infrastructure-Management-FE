import { StatsCard } from "@/components/StatsCard";
import { LayoutGrid, CheckCircle2, XCircle, PlusCircle } from "lucide-react";

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng số khu vực"
        value={stats?.totalZones || 0}
        icon={LayoutGrid}
        description="Tổng số khu vực trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.activeZones || 0}
        icon={CheckCircle2}
        description="Khu vực đang hoạt động"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.inactiveZones || 0}
        icon={XCircle}
        description="Khu vực ngừng hoạt động"
        variant="danger"
        isLoading={loading}
      />
      <StatsCard
        title="Khu vực mới trong tháng"
        value={stats?.newZonesThisMonth || 0}
        icon={PlusCircle}
        description="Khu vực mới trong tháng"
        variant="info"
        isLoading={loading}
      />
    </div>
  );
}
