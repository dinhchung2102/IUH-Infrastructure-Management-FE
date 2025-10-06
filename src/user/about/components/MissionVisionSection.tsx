import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { Target, Eye } from "lucide-react";

export function MissionVisionSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal delay={0}>
            <Card className="hover:shadow-xl transition-all cursor-pointer">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Sứ mệnh</CardTitle>
                <CardDescription>
                  Cung cấp và duy trì cơ sở vật chất chất lượng cao, tạo môi
                  trường thuận lợi cho hoạt động giảng dạy, học tập và nghiên
                  cứu khoa học. Đảm bảo an toàn, tiện nghi và hiệu quả trong
                  việc sử dụng tài nguyên.
                </CardDescription>
              </CardHeader>
            </Card>
          </Reveal>

          <Reveal delay={0.2}>
            <Card className="hover:shadow-xl transition-all cursor-pointer">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Tầm nhìn</CardTitle>
                <CardDescription>
                  Trở thành đơn vị quản lý cơ sở vật chất tiên tiến, ứng dụng
                  công nghệ thông minh trong vận hành và bảo trì. Xây dựng hệ
                  thống phản hồi nhanh chóng, minh bạch và thân thiện với người
                  dùng.
                </CardDescription>
              </CardHeader>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
