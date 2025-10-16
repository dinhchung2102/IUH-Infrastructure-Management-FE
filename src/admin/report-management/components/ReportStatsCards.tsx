import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ReportStatsCardsProps {
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
    todayReports: number;
  };
}

export function ReportStatsCards({ stats }: ReportStatsCardsProps) {
  const cards = [
    {
      title: "Tổng báo cáo",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: `+${stats.todayReports} hôm nay`,
      trend: "up" as const,
    },
    {
      title: "Chờ xử lý",
      value: stats.pending,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: `${((stats.pending / stats.total) * 100).toFixed(0)}% tổng số`,
      trend: "neutral" as const,
    },
    {
      title: "Đang xử lý",
      value: stats.inProgress,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: `${((stats.inProgress / stats.total) * 100).toFixed(0)}% tổng số`,
      trend: "neutral" as const,
    },
    {
      title: "Đã giải quyết",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: `${((stats.resolved / stats.total) * 100).toFixed(0)}% tổng số`,
      trend: "up" as const,
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {card.trend === "up" && (
                <Badge variant="default" className="text-xs">
                  {card.change}
                </Badge>
              )}
              {card.trend === "neutral" && (
                <Badge variant="secondary" className="text-xs">
                  {card.change}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
