import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { Building2, Users, Clock, Award } from "lucide-react";

const stats = [
  { icon: Building2, value: "50+", label: "Phòng/Khu vực" },
  { icon: Users, value: "30K+", label: "Người dùng" },
  { icon: Clock, value: "24/7", label: "Hỗ trợ" },
  { icon: Award, value: "98%", label: "Hài lòng" },
];

export function AboutStatsSection() {
  return (
    <section className="container py-16">
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Reveal key={index} delay={index * 0.15}>
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <Icon className="mx-auto mb-3 h-10 w-10 text-primary" />
                  <div className="mb-1 text-3xl font-bold">{stat.value}</div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
