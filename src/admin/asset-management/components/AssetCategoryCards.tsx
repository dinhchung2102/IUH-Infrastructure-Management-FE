import { StatsCard } from "@/components/StatsCard";
import { Building2, CheckCircle2, XCircle, PlusCircle } from "lucide-react";

interface Props {
  stats: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
}

export function AssetCategoryCards({ stats }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng danh mục"
        value={stats.total}
        icon={Building2}
        description="Tổng số danh mục thiết bị"
        variant="default"
      />
      <StatsCard
        title="Đang hoạt động"
        value={stats.active}
        icon={CheckCircle2}
        description="Danh mục đang hoạt động"
        variant="success"
      />
      <StatsCard
        title="Ngừng hoạt động"
        value={stats.inactive}
        icon={XCircle}
        description="Danh mục ngừng hoạt động"
        variant="danger"
      />
      <StatsCard
        title="Mới tháng này"
        value={stats.newThisMonth}
        icon={PlusCircle}
        description="Danh mục mới trong tháng"
        variant="info"
      />
    </div>
  );
}
