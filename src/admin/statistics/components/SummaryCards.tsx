import { StatsCard } from "@/components/StatsCard";
import { Building2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import type { OverallStatisticsData } from "../api/statistics.api";

interface SummaryCardsProps {
  overallStats: OverallStatisticsData | null;
  loading: boolean;
}

export function SummaryCards({ overallStats, loading }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng báo cáo"
        value={overallStats?.totalReports ?? 0}
        icon={FileText}
        description="Tổng số báo cáo trong hệ thống"
        variant="default"
        isLoading={loading}
      />
      <StatsCard
        title="Tổng tài sản"
        value={overallStats?.totalAssets ?? 0}
        icon={Building2}
        description="Tổng số thiết bị trong hệ thống"
        variant="info"
        isLoading={loading}
      />
      <StatsCard
        title="Nhiệm vụ đã hoàn thành"
        value={`${overallStats?.completedAuditLogs ?? 0} / ${
          overallStats?.totalAuditLogs ?? 0
        }`}
        icon={CheckCircle2}
        description={`Tỷ lệ hoàn thành: ${
          overallStats?.completionRate
            ? `${overallStats.completionRate.toFixed(1)}%`
            : "0%"
        }`}
        variant="success"
        isLoading={loading}
      />
      <StatsCard
        title="Tỷ lệ xử lý"
        value={
          overallStats?.resolutionRate
            ? `${overallStats.resolutionRate.toFixed(1)}%`
            : "0%"
        }
        icon={AlertCircle}
        description="Tỷ lệ xử lý sự cố (báo cáo đã được phê duyệt)"
        variant="warning"
        isLoading={loading}
      />
    </div>
  );
}
