import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const cards = [
    {
      title: "Tổng vai trò",
      value: stats.totalRoles,
      icon: Shield,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Vai trò hệ thống",
      value: stats.systemRoles,
      icon: Lock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Vai trò tùy chỉnh",
      value: stats.customRoles,
      icon: Key,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className={`rounded-full p-2 ${card.bgColor}`}>
              <card.icon className={`size-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
