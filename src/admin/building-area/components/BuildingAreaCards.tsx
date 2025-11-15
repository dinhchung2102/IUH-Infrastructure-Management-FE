import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, Wrench } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { BuildingAreaStats } from "../api/building-area.api";

interface BuildingAreaCardsProps {
  stats?: BuildingAreaStats;
  loading?: boolean;
}

export function BuildingAreaCards({ stats, loading }: BuildingAreaCardsProps) {
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
        title="Tổng tòa nhà & K.V. Ngoài trời"
        value={stats?.totalAll || 0}
        icon={Building2}
        description="Tổng số tòa nhà và K.V. Ngoài trời"
        variant="default"
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.totalActive || 0}
        icon={CheckCircle2}
        description="Tòa nhà và K.V. Ngoài trời đang hoạt động"
        variant="success"
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.totalInactive || 0}
        icon={XCircle}
        description="Tòa nhà và K.V. Ngoài trời ngừng hoạt động"
        variant="danger"
      />
      <StatsCard
        title="Đang bảo trì"
        value={stats?.totalUnderMaintenance || 0}
        icon={Wrench}
        description="Tòa nhà và K.V. Ngoài trời đang bảo trì"
        variant="warning"
      />
    </div>
  );
}
