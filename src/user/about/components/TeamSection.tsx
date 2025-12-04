import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <h2
            className="mb-3 text-2xl sm:text-3xl font-bold uppercase"
            style={{ color: "#204195" }}
          >
            Ban lãnh đạo
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Đội ngũ lãnh đạo có nhiều năm kinh nghiệm trong công tác quản lý cơ
            sở vật chất
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {leadership.map((leader, index) => {
            const Icon = leader.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-lg ${leader.bgColor}`}
                  >
                    <Icon className={`h-7 w-7 ${leader.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold mb-1">
                    {leader.name}
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-primary mb-3">
                    {leader.position}
                  </CardDescription>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {leader.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
