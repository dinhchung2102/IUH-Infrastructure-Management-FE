import { StatsCard } from "@/components/StatsCard";
import { Package, Layers, Wrench, ImageOff } from "lucide-react";
import type { AssetDashboardStats } from "../api/stats.api";

export interface AssetStatsCardsProps {
  stats?: AssetDashboardStats;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

export function AssetStatsCards({ stats, loading }: AssetStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng thiết bị"
        value={stats?.totalAssets || 0}
        icon={Package}
        description="Tổng số thiết bị trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Đang sử dụng"
        value={stats?.assetsByStatus?.IN_USE || 0}
        icon={Layers}
        description="Thiết bị đang được sử dụng"
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Đang bảo trì"
        value={stats?.assetsByStatus?.UNDER_MAINTENANCE || 0}
        icon={Wrench}
        description="Thiết bị đang bảo trì"
        variant="warning"
        isLoading={loading}
      />
      <StatsCard
        title="Hư hỏng"
        value={stats?.assetsByStatus?.DAMAGED || 0}
        icon={ImageOff}
        description="Thiết bị bị hư hỏng"
        variant="danger"
        isLoading={loading}
      />
    </div>
  );
}
