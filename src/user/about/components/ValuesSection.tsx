import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { Target, CheckCircle2, Users, TrendingUp } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Hiệu quả",
    description: "Xử lý nhanh chóng, đảm bảo chất lượng và tiết kiệm chi phí",
  },
  {
    icon: CheckCircle2,
    title: "Minh bạch",
    description:
      "Công khai quy trình, cập nhật tiến độ liên tục cho người dùng",
  },
  {
    icon: Users,
    title: "Trách nhiệm",
    description: "Cam kết phục vụ tốt nhất, đặt lợi ích cộng đồng lên hàng đầu",
  },
  {
    icon: TrendingUp,
    title: "Cải tiến",
    description: "Không ngừng nâng cao chất lượng dịch vụ và cơ sở vật chất",
  },
];

export function ValuesSection() {
  return (
    <section className="container py-16 md:py-24">
      <Reveal>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Giá trị cốt lõi</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Những nguyên tắc định hướng mọi hoạt động của chúng tôi
          </p>
        </div>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <Reveal key={index} delay={index * 0.15}>
              <Card className="text-center hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {value.description}
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
