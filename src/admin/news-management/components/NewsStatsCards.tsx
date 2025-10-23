import { StatsCard } from "@/components/StatsCard";
import { Newspaper, CheckCircle, FileText, TrendingUp } from "lucide-react";
import type { NewsStats } from "../types/news.type";

interface NewsStatsCardsProps {
  stats: NewsStats;
}

export function NewsStatsCards({ stats }: NewsStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng tin tức"
        value={stats.total}
        icon={Newspaper}
        description="Tổng số bài viết"
        trend={{ value: 0, isPositive: true }}
      />
      <StatsCard
        title="Đã xuất bản"
        value={stats.published}
        icon={CheckCircle}
        description="Đang hiển thị công khai"
        trend={{ value: 0, isPositive: true }}
        className="bg-green-50 border-green-200"
      />
      <StatsCard
        title="Bản nháp"
        value={stats.draft}
        icon={FileText}
        description="Chưa xuất bản"
        trend={{ value: 0, isPositive: false }}
        className="bg-orange-50 border-orange-200"
      />
      <StatsCard
        title="Mới tháng này"
        value={stats.newThisMonth}
        icon={TrendingUp}
        description="Được tạo trong tháng"
        trend={{ value: 0, isPositive: true }}
        className="bg-blue-50 border-blue-200"
      />
    </div>
  );
}
