import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    label: "Báo cáo đã xử lý",
    value: "500+",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    label: "Thời gian phản hồi",
    value: "< 24h",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    label: "Tỷ lệ giải quyết",
    value: "95%",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    label: "Tài sản quản lý",
    value: "1,000+",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
];

export function AboutStatsSection() {
  return (
    <section className="container -mt-12 relative z-20 pb-12">
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index}>
              <Card className="border cursor-default border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div
                      className={`${stat.bgColor} ${stat.color} p-3 rounded-xl shadow-sm`}
                    >
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
                      {stat.value}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </section>
  );
}
