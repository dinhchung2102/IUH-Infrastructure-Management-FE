import { StatsCard } from "@/components/StatsCard";
import { Shield, Lock, Users, Key } from "lucide-react";

interface RoleStatsCardsProps {
  stats: {
    totalRoles: number;
    systemRoles: number;
    customRoles: number;
    totalUsers: number;
  };
}

export function RoleStatsCards({ stats }: RoleStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Tổng vai trò"
        value={stats.totalRoles}
        icon={Shield}
        description="Tổng số vai trò trong hệ thống"
        variant="default"
      />
      <StatsCard
        title="Vai trò hệ thống"
        value={stats.systemRoles}
        icon={Lock}
        description="Vai trò được tạo bởi hệ thống"
        variant="info"
      />
      <StatsCard
        title="Vai trò tùy chỉnh"
        value={stats.customRoles}
        icon={Key}
        description="Vai trò được tạo tùy chỉnh"
        variant="success"
      />
      <StatsCard
        title="Tổng người dùng"
        value={stats.totalUsers}
        icon={Users}
        description="Tổng số người dùng trong hệ thống"
        variant="warning"
      />
    </div>
  );
}
