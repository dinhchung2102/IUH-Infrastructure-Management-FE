import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import {
  Wrench,
  Zap,
  Droplets,
  Building,
  BarChart3,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const functions = [
  {
    icon: Wrench,
    title: "Quản lý thiết bị",
    description:
      "Quản lý toàn bộ hệ thống điện, cấp thoát nước, công trình kiến trúc trong Trường",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Zap,
    title: "Hệ thống điện",
    description:
      "Tổ chức quản lý, vận hành, bảo trì, thay thế hệ thống điện tổng thể trong Trường",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    icon: Droplets,
    title: "Hệ thống nước",
    description:
      "Quản lý, vận hành toàn bộ hệ thống cấp thoát nước trong Trường",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    icon: Building,
    title: "Quản trị cơ sở",
    description:
      "Quản lý toàn bộ cơ sở hạ tầng đất đai, nhà cửa, lớp học, phòng làm việc",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: BarChart3,
    title: "Báo cáo & Tư vấn",
    description:
      "Tổng hợp, thống kê, báo cáo và tư vấn về tình hình thiết bị, điện, nước",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: Settings,
    title: "Đầu tư & Xây dựng",
    description: "Xây dựng kế hoạch đầu tư, phối hợp đấu thầu mua sắm thiết bị",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: Shield,
    title: "An toàn & Bảo vệ",
    description:
      "Phối hợp tổ chức công tác phòng chống bão, lụt và phòng cháy chữa cháy",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    icon: Users,
    title: "Phối hợp liên ngành",
    description:
      "Phối hợp với các bộ phận liên quan trong quy hoạch và quản lý dự án",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
];

export function FunctionsSection() {
  return (
    <section className="container py-16 md:py-24">
      <Reveal delay={0}>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Chức năng & Nhiệm vụ
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            Các chức năng chính của Phòng Quản Trị trong việc quản lý toàn diện
            cơ sở hạ tầng và thiết bị của Trường
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {functions.map((func, index) => {
          const Icon = func.icon;
          return (
            <Reveal key={index} delay={0.8 + index * 0.1}>
              <Card className="text-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer group">
                <CardHeader>
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${func.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-7 w-7 ${func.color}`} />
                  </div>
                  <CardTitle className="text-lg font-bold">
                    {func.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {func.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
