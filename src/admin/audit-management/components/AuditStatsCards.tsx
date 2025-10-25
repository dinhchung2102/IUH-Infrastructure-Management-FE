import { StatsCard } from "@/components/StatsCard";
import { Clock, CheckCircle2, XCircle, PlayCircle } from "lucide-react";

interface AuditStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
    todayAudits: number;
  };
}

export function AuditStatsCards({ stats }: AuditStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Chờ xử lý"
        value={stats.pending}
        icon={Clock}
        description={`${((stats.pending / stats.total) * 100 || 0).toFixed(
          0
        )}% tổng số`}
        variant="warning"
      />
      <StatsCard
        title="Đang xử lý"
        value={stats.inProgress}
        icon={PlayCircle}
        description={`${((stats.inProgress / stats.total) * 100 || 0).toFixed(
          0
        )}% tổng số`}
        variant="info"
      />
      <StatsCard
        title="Hoàn thành"
        value={stats.completed}
        icon={CheckCircle2}
        description={`${((stats.completed / stats.total) * 100 || 0).toFixed(
          0
        )}% tổng số`}
        variant="success"
      />
      <StatsCard
        title="Đã hủy"
        value={stats.cancelled}
        icon={XCircle}
        description={`${((stats.cancelled / stats.total) * 100 || 0).toFixed(
          0
        )}% tổng số`}
        variant="danger"
      />
    </div>
  );
}
