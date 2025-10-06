import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { CheckCircle2, Clock, TrendingUp } from "lucide-react";

const stats = [
  { label: "Báo cáo đã xử lý", value: "1,234", icon: CheckCircle2 },
  { label: "Thời gian trung bình", value: "2.5h", icon: Clock },
  { label: "Tỷ lệ hài lòng", value: "98%", icon: TrendingUp },
];

export function StatsSection() {
  return (
    <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Reveal key={index} delay={index * 0.2}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Icon className="mb-2 h-8 w-8 text-primary" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
