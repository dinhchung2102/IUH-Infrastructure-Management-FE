import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Wrench,
  Zap,
  Droplets,
  Building,
  Settings,
  Shield,
} from "lucide-react";

const functions = [
  {
    icon: Building,
    title: "Quản lý cơ sở hạ tầng",
    description:
      "Quản lý đất đai, nhà cửa, lớp học, phòng làm việc và các công trình kiến trúc",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: Zap,
    title: "Hệ thống điện",
    description:
      "Vận hành, bảo trì và quản lý hệ thống điện tổng thể của Trường",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    icon: Droplets,
    title: "Hệ thống nước",
    description: "Quản lý và vận hành hệ thống cấp thoát nước",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    icon: Wrench,
    title: "Quản lý thiết bị",
    description: "Quản lý, bảo trì và sửa chữa các thiết bị trong Trường",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    icon: Settings,
    title: "Đầu tư xây dựng",
    description: "Lập kế hoạch đầu tư, phối hợp đấu thầu và mua sắm thiết bị",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: Shield,
    title: "An toàn lao động",
    description:
      "Phối hợp công tác phòng chống thiên tai, phòng cháy chữa cháy",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
];

export function FunctionsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        <div className="mb-8">
          <h2
            className="text-2xl sm:text-3xl font-bold uppercase"
            style={{ color: "#204195" }}
          >
            Chức năng & Nhiệm vụ
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {functions.map((func, index) => {
            const Icon = func.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${func.bgColor}`}
                  >
                    <Icon className={`h-6 w-6 ${func.color}`} />
                  </div>
                  <CardTitle className="text-base font-semibold mb-2">
                    {func.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {func.description}
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
