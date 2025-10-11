import { Building, GraduationCap, FlaskConical, Users } from "lucide-react";
import { AnimatedCard } from "@/components/motion";

const stats = [
  {
    icon: Building,
    label: "Tòa nhà",
    value: "12",
    description: "Tòa nhà học tập và hành chính",
  },
  {
    icon: GraduationCap,
    label: "Phòng học",
    value: "150+",
    description: "Phòng học hiện đại, tiện nghi",
  },
  {
    icon: FlaskConical,
    label: "Phòng thí nghiệm",
    value: "45+",
    description: "Phòng lab chuyên dụng",
  },
  {
    icon: Users,
    label: "Phòng họp",
    value: "30+",
    description: "Phòng hội thảo & họp nhóm",
  },
];

export function FacilitiesStats() {
  return (
    <section className="border-y bg-muted/30 py-12">
      <div className="container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <AnimatedCard
                key={stat.label}
                delay={index * 0.1}
                className="flex flex-col items-center text-center p-6"
              >
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Icon className="size-6 text-primary" />
                </div>
                <div className="mb-2 text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mb-1 font-semibold">{stat.label}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
