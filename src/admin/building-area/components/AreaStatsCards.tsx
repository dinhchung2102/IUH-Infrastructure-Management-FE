import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, Wrench } from "lucide-react";
import type { AreaStatsResponse } from "../api/area.api";

interface AreaStatsCardsProps {
  stats?: AreaStatsResponse;
  loading?: boolean;
}

export function AreaStatsCards({ stats, loading }: AreaStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng khu vực"
        value={stats?.total || 0}
        icon={Building2}
        description="Tổng số khu vực ngoài trời trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats?.active || 0}
        icon={CheckCircle2}
        description="Khu vực ngoài trời đang hoạt động"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats?.inactive || 0}
        icon={XCircle}
        description="Khu vực ngoài trời ngừng hoạt động"
        variant="danger"
        isLoading={loading}
      />
      <StatsCard
        title="Đang bảo trì"
        value={stats?.underMaintenance || 0}
        icon={Wrench}
        description="Khu vực ngoài trời đang bảo trì"
        variant="warning"
        isLoading={loading}
      />
    </div>
  );
}

