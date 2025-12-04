import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
} from "lucide-react";

export function ReportGuideSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Hướng dẫn báo cáo sự cố
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-100 dark:bg-blue-900/30 p-1.5">
                <MapPin className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  Xác định vị trí sự cố
                </h4>
                <p className="text-sm text-muted-foreground">
                  Chọn cơ sở, tòa nhà (nếu có), tầng và khu vực cụ thể nơi xảy
                  ra sự cố. Điều này giúp đội ngũ kỹ thuật nhanh chóng tiếp cận
                  và xử lý.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-purple-100 dark:bg-purple-900/30 p-1.5">
                <FileText className="size-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  Mô tả chi tiết sự cố
                </h4>
                <p className="text-sm text-muted-foreground">
                  Cung cấp thông tin mô tả rõ ràng về sự cố, bao gồm loại sự cố
                  và các chi tiết liên quan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-green-100 dark:bg-green-900/30 p-1.5">
                <Camera className="size-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  Đính kèm hình ảnh
                </h4>
                <p className="text-sm text-muted-foreground">
                  Chụp và đính kèm hình ảnh minh họa sự cố (nếu có). Hình ảnh
                  giúp đội ngũ kỹ thuật đánh giá chính xác hơn về tình trạng sự
                  cố.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-orange-100 dark:bg-orange-900/30 p-1.5">
                <CheckCircle2 className="size-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1">
                  Xác thực thông tin
                </h4>
                <p className="text-sm text-muted-foreground">
                  Nếu chưa đăng nhập, bạn sẽ nhận được mã OTP qua email để xác
                  thực thông tin trước khi gửi báo cáo.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            Lưu ý quan trọng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <p className="text-sm text-muted-foreground">
              Vui lòng điền đầy đủ các thông tin bắt buộc (đánh dấu *) để báo
              cáo được xử lý nhanh chóng.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <p className="text-sm text-muted-foreground">
              Báo cáo sẽ được xử lý trong thời gian sớm nhất. Bạn sẽ nhận được
              thông báo qua email về tiến độ xử lý.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <p className="text-sm text-muted-foreground">
              Đối với các sự cố khẩn cấp, vui lòng liên hệ trực tiếp qua hotline
              để được hỗ trợ ngay lập tức.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Thời gian xử lý
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sự cố khẩn cấp:</span>
              <span className="font-semibold">Ngay lập tức</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sự cố nghiêm trọng:</span>
              <span className="font-semibold">Trong 2-4 giờ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sự cố thông thường:</span>
              <span className="font-semibold">Trong 24 giờ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="size-5" />
            Liên hệ hỗ trợ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Hotline:</span>
              <span className="ml-2 font-semibold">(028) 3894 0393</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-semibold">quantri@iuh.edu.vn</span>
            </div>
            <div>
              <span className="text-muted-foreground">Giờ làm việc:</span>
              <span className="ml-2 font-semibold">
                Thứ 2 - Thứ 6: 7:30 - 16:30
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
