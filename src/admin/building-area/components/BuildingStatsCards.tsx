import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BuildingStatsResponse } from "../api/building.api";

interface BuildingStatsCardsProps {
  stats?: BuildingStatsResponse;
  loading?: boolean;
}

export function BuildingStatsCards({ stats, loading }: BuildingStatsCardsProps) {
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
        title="Tổng tòa nhà"
        value={stats?.total || 0}
        icon={Building2}
        description="Tổng số tòa nhà trong hệ thống"
        variant="default"
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.active || 0}
        icon={CheckCircle2}
        description="Tòa nhà đang hoạt động"
        variant="success"
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.inactive || 0}
        icon={XCircle}
        description="Tòa nhà ngừng hoạt động"
        variant="danger"
      />
      <StatsCard
        title="Đang bảo trì"
        value={stats?.underMaintenance || 0}
        icon={Wrench}
        description="Tòa nhà đang bảo trì"
        variant="warning"
      />
    </div>
  );
}

