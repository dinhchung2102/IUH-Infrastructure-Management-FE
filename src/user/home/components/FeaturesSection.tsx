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
    <section className="container py-16 md:py-24 lg:py-32">
      <Reveal>
        <div className="mb-16 text-center">
          <div className="inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Tính năng
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            Tính năng nổi bật
          </h2>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-muted-foreground">
            Giải pháp toàn diện giúp bạn quản lý và theo dõi các vấn đề về cơ sở
            vật chất một cách hiệu quả nhất
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Reveal key={index} delay={index * 0.15}>
              <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 group">
                <CardHeader className="pb-8">
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-3">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                {/* Decorative gradient on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Card>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
