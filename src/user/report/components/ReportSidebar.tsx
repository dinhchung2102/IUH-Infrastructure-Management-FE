import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { AlertCircle, Clock } from "lucide-react";

export function ReportSidebar() {
  return (
    <div className="space-y-6">
      {/* Guidelines */}
      <Reveal delay={0.2}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Hướng dẫn báo cáo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p>Mô tả rõ ràng, chi tiết vấn đề gặp phải</p>
            </div>
            <div className="flex gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p>Cung cấp vị trí chính xác của sự cố</p>
            </div>
            <div className="flex gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p>Đính kèm hình ảnh nếu có thể</p>
            </div>
            <div className="flex gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <p>Chọn mức độ ưu tiên phù hợp</p>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Response Time */}
      <Reveal delay={0.3}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Thời gian phản hồi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Khẩn cấp:</span>
              <span className="font-medium text-red-500">Ngay lập tức</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cao:</span>
              <span className="font-medium text-orange-500">1-2 giờ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trung bình:</span>
              <span className="font-medium text-yellow-500">4-6 giờ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thấp:</span>
              <span className="font-medium text-green-500">1-2 ngày</span>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Emergency Contact */}
      <Reveal delay={0.4}>
        <Card className="border-destructive/50 bg-destructive/5 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">
              Trường hợp khẩn cấp
            </CardTitle>
            <CardDescription>Gọi ngay hotline 24/7</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="tel:+842838942223"
              className="text-xl font-bold text-destructive hover:underline"
            >
              (028) 3894 2223
            </a>
            <p className="mt-2 text-sm text-muted-foreground">
              Dành cho các trường hợp nguy hiểm đến an toàn
            </p>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
