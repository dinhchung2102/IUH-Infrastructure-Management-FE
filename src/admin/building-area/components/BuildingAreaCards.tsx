import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, Wrench } from "lucide-react";
import type { BuildingAreaStats } from "../api/building-area.api";

interface BuildingAreaCardsProps {
  stats?: BuildingAreaStats;
  loading?: boolean;
}

export function BuildingAreaCards({ stats, loading }: BuildingAreaCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng tòa nhà & K.V. Ngoài trời"
        value={stats?.totalAll || 0}
        icon={Building2}
        description="Tổng số tòa nhà và K.V. Ngoài trời"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.totalActive || 0}
        icon={CheckCircle2}
        description="Tòa nhà và K.V. Ngoài trời đang hoạt động"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.totalInactive || 0}
        icon={XCircle}
        description="Tòa nhà và K.V. Ngoài trời ngừng hoạt động"
        variant="danger"
        isLoading={loading}
      />
      <StatsCard
        title="Đang bảo trì"
        value={stats?.totalUnderMaintenance || 0}
        icon={Wrench}
        description="Tòa nhà và K.V. Ngoài trời đang bảo trì"
        variant="warning"
        isLoading={loading}
      />
    </div>
  );
}
