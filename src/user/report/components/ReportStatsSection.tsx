import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { CheckCircle2, Clock, FileText } from "lucide-react";

const stats = [
  {
    icon: CheckCircle2,
    label: "Đã xử lý",
    value: "98%",
    color: "text-green-500",
  },
  {
    icon: Clock,
    label: "Thời gian TB",
    value: "2.5h",
    color: "text-blue-500",
  },
  {
    icon: FileText,
    label: "Báo cáo tháng này",
    value: "142",
    color: "text-purple-500",
  },
];

export function ReportStatsSection() {
  return (
    <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Reveal key={index} delay={index * 0.15}>
            <Card className="border-none shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        );
      })}
    </div>
  );
}
