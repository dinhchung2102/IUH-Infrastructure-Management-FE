import { StatsCard } from "@/components/StatsCard";
import { FileText, CheckCircle2, AlertCircle, Wrench } from "lucide-react";

interface MyReportStatsCardsProps {
  summary: {
    total: number;
    byStatus: {
      PENDING: number;
      APPROVED: number;
      REJECTED: number;
      RESOLVED: number;
    };
    byType: {
      MAINTENANCE: number;
      DAMAGED: number;
      OTHER: number;
    };
  };
}

export function MyReportStatsCards({ summary }: MyReportStatsCardsProps) {
  const { total, byStatus, byType } = summary;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng báo cáo"
        value={total}
        icon={FileText}
        description={`${
          byType.MAINTENANCE + byType.DAMAGED + byType.OTHER
        } báo cáo`}
        variant="default"
      />
      <StatsCard
        title="Chờ xử lý"
        value={byStatus.PENDING}
        icon={AlertCircle}
        description={`${
          total > 0 ? ((byStatus.PENDING / total) * 100).toFixed(0) : 0
        }% tổng số`}
        variant="warning"
      />
      <StatsCard
        title="Đã duyệt"
        value={byStatus.APPROVED}
        icon={CheckCircle2}
        description={`${
          total > 0 ? ((byStatus.APPROVED / total) * 100).toFixed(0) : 0
        }% tổng số`}
        variant="success"
      />
      <StatsCard
        title="Đã xử lý"
        value={byStatus.RESOLVED}
        icon={Wrench}
        description={`${
          total > 0 ? ((byStatus.RESOLVED / total) * 100).toFixed(0) : 0
        }% tổng số`}
        variant="info"
      />
    </div>
  );
}
