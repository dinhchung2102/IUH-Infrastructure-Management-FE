import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { User, Users } from "lucide-react";

const leadership = [
  {
    name: "ThS. Nguyễn Quý Tuấn",
    position: "Trưởng phòng",
    description:
      "Chịu trách nhiệm tổng thể về công tác quản trị và quản lý cơ sở hạ tầng của Trường",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    name: "ThS. Đinh Hồng Nam",
    position: "Phó trưởng phòng",
    description:
      "Hỗ trợ Trưởng phòng trong việc quản lý và điều phối các hoạt động chuyên môn",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
];

export function TeamSection() {
  return (
    <section className="border-t bg-muted/30 py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Ban lãnh đạo
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Đội ngũ lãnh đạo chuyên nghiệp, có kinh nghiệm và tận tâm với sự
              nghiệp giáo dục
            </p>
          </div>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {leadership.map((leader, index) => {
            const Icon = leader.icon;
            return (
              <Reveal key={index} delay={index * 0.2}>
                <Card className="hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                  <CardHeader className="text-center">
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${leader.bgColor} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`h-8 w-8 ${leader.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold">
                      {leader.name}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-primary mb-3">
                      {leader.position}
                    </CardDescription>
                    <CardDescription className="text-sm leading-relaxed">
                      {leader.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
