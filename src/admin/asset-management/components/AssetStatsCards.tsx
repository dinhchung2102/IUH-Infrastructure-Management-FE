import { StatsCard } from "@/components/StatsCard";
import { Package, Layers, Wrench, ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { AssetDashboardStats } from "../api/stats.api";

export interface AssetStatsCardsProps {
  stats?: AssetDashboardStats;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}

export function AssetStatsCards({ stats, loading }: AssetStatsCardsProps) {
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
        title="Tổng thiết bị"
        value={stats?.totalAssets || 0}
        icon={Package}
        description="Tổng số thiết bị trong hệ thống"
        variant="default"
      />
      <StatsCard
        title="Đang sử dụng"
        value={stats?.assetsByStatus?.IN_USE || 0}
        icon={Layers}
        description="Thiết bị đang được sử dụng"
        variant="success"
      />
      <StatsCard
        title="Đang bảo trì"
        value={stats?.assetsByStatus?.UNDER_MAINTENANCE || 0}
        icon={Wrench}
        description="Thiết bị đang bảo trì"
        variant="warning"
      />
      <StatsCard
        title="Hư hỏng"
        value={stats?.assetsByStatus?.DAMAGED || 0}
        icon={ImageOff}
        description="Thiết bị bị hư hỏng"
        variant="danger"
      />
    </div>
  );
}
