import { StatsCard } from "@/components/StatsCard";
import { CheckCircle, XCircle, Layers } from "lucide-react";
import type { NewsCategoryStats } from "../types/news-category.type";

interface NewsCategoryStatsCardsProps {
  stats: NewsCategoryStats;
}

export function NewsCategoryStatsCards({ stats }: NewsCategoryStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatsCard
        title="Tổng danh mục"
        value={stats.total}
        icon={Layers}
        description="Tổng số danh mục"
        trend={{ value: 0, isPositive: true }}
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats.active}
        icon={CheckCircle}
        description="Danh mục đang hiển thị"
        trend={{ value: 0, isPositive: true }}
        className="bg-green-50 border-green-200"
      />
      <StatsCard
        title="Ngưng hoạt động"
        value={stats.inactive}
        icon={XCircle}
        description="Danh mục đã ẩn"
        trend={{ value: 0, isPositive: false }}
        className="bg-red-50 border-red-200"
      />
    </div>
  );
}
