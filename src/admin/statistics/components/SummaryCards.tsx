import { StatsCard } from "@/components/StatsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building2, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import type { OverallStatisticsData } from "../api/statistics.api";

interface SummaryCardsProps {
  overallStats: OverallStatisticsData | null;
  loading: boolean;
}

export function SummaryCards({ overallStats, loading }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng báo cáo"
        value={overallStats?.totalReports ?? 0}
        icon={FileText}
        description="Tổng số báo cáo trong hệ thống"
        variant="default"
      />
      <StatsCard
        title="Tổng tài sản"
        value={overallStats?.totalAssets ?? 0}
        icon={Building2}
        description="Tổng số thiết bị trong hệ thống"
        variant="info"
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
      />
    </div>
  );
}
