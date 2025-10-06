import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Clock, Bell } from "lucide-react";
import { Reveal } from "@/components/motion";

const features = [
  {
    icon: FileText,
    title: "Báo cáo nhanh",
    description:
      "Báo cáo các sự cố về cơ sở vật chất một cách nhanh chóng và dễ dàng với form đơn giản",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    icon: Clock,
    title: "Theo dõi tiến trình",
    description:
      "Cập nhật tình trạng xử lý sự cố của bạn theo thời gian thực với thông báo tức thì",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    icon: Bell,
    title: "Thông báo tức thì",
    description:
      "Nhận thông báo ngay khi có cập nhật về báo cáo của bạn qua email hoặc hệ thống",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950",
  },
];

export function FeaturesSection() {
  return (
    <section className="container py-16 md:py-24">
      <Reveal>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Tính năng nổi bật
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Giải pháp toàn diện giúp bạn quản lý và theo dõi các vấn đề về cơ sở
            vật chất một cách hiệu quả
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Reveal key={index} delay={index * 0.2}>
              <Card className="transition-all hover:shadow-xl hover:scale-105 cursor-pointer">
                <CardHeader>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
