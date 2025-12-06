import { StatsCard } from "@/components/StatsCard";
import { FileText, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface ReportStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    todayReports: number;
    reportsThisMonth: number;
    reportsLastMonth: number;
    averageResolutionTime: number;
  };
}

export function ReportStatsCards({ stats }: ReportStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng báo cáo"
        value={stats.total}
        icon={FileText}
        description={`${stats.reportsThisMonth} báo cáo trong tháng`}
        variant="default"
      />
      <StatsCard
        title="Chờ xử lý"
        value={stats.pending}
        icon={AlertCircle}
        description={`${
          stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(0) : 0
        }% tổng số`}
        variant="warning"
      />
      <StatsCard
        title="Đã duyệt"
        value={stats.approved}
        icon={CheckCircle2}
        description={`${
          stats.total > 0
            ? ((stats.approved / stats.total) * 100).toFixed(0)
            : 0
        }% tổng số`}
        variant="success"
      />
      <StatsCard
        title="Đã từ chối"
        value={stats.rejected}
        icon={XCircle}
        description={`${
          stats.total > 0
            ? ((stats.rejected / stats.total) * 100).toFixed(0)
            : 0
        }% tổng số`}
        variant="danger"
      />
    </div>
  );
}
