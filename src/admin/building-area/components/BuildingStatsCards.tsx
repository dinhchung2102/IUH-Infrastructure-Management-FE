import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, Wrench } from "lucide-react";
import type { BuildingStatsResponse } from "../api/building.api";

interface BuildingStatsCardsProps {
  stats?: BuildingStatsResponse;
  loading?: boolean;
}

export function BuildingStatsCards({ stats, loading }: BuildingStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng tòa nhà"
        value={stats?.total || 0}
        icon={Building2}
        description="Tổng số tòa nhà trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.active || 0}
        icon={CheckCircle2}
        description="Tòa nhà đang hoạt động"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.inactive || 0}
        icon={XCircle}
        description="Tòa nhà ngừng hoạt động"
        variant="danger"
        isLoading={loading}
      />
      <StatsCard
        title="Đang bảo trì"
        value={stats?.underMaintenance || 0}
        icon={Wrench}
        description="Tòa nhà đang bảo trì"
        variant="warning"
        isLoading={loading}
      />
    </div>
  );
}

