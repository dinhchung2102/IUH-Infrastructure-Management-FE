import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal, Parallax } from "@/components/motion";
import { Users, FileText, CheckCircle2, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutIntroSection() {
  return (
    <section className="container py-8 md:py-12 lg:py-16">
      <Parallax from={-30} to={30}>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Content */}
          <Reveal>
            <div>
              <h2
                className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl uppercase"
                style={{ color: "#204195" }}
              >
                Phòng Quản Trị
              </h2>

              <div className="space-y-4 text-base md:text-base text-muted-foreground">
                <p className="text-justify ">
                  <strong className="text-foreground">
                    Phòng Quản Trị trường Đại học Công nghiệp TP.HCM
                  </strong>{" "}
                  là đơn vị trực thuộc trường Đại học Công nghiệp TP.HCM, chịu
                  trách nhiệm quản lý, bảo trì và nâng cấp toàn bộ cơ sở vật
                  chất của trường.
                </p>

                <p className="text-justify">
                  Với đội ngũ cán bộ chuyên nghiệp và tận tâm, chúng tôi cam kết
                  đảm bảo môi trường học tập và làm việc an toàn, hiện đại, đáp
                  ứng nhu cầu của hơn{" "}
                  <span className="font-semibold text-foreground">
                    20,000 sinh viên
                  </span>{" "}
                  và{" "}
                  <span className="font-semibold text-foreground">
                    1,000 cán bộ giảng viên
                  </span>
                  .
                </p>

                <p className="text-justify">
                  Hệ thống quản lý báo cáo sự cố này được phát triển nhằm{" "}
                  <span className="font-semibold text-foreground">
                    nâng cao hiệu quả xử lý
                  </span>
                  , tăng tính minh bạch và tạo kênh liên lạc trực tiếp giữa
                  người dùng và phòng quản trị IUH.
                </p>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/about">Tìm hiểu thêm</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Right Content - Key Features Grid */}
          <Reveal delay={0.2}>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Feature Card 1 */}
              <Card className="group cursor-default relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50  bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
                    Báo cáo dễ dàng
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gửi báo cáo sự cố chỉ trong vài phút với form đơn giản, rõ
                    ràng
                  </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Card>

              {/* Feature Card 2 */}
              <Card className="group cursor-default relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50  bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/30 text-green-600 group-hover:scale-110 transition-transform shadow-sm">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
                    Xử lý nhanh chóng
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đội ngũ kỹ thuật nhận thông báo ngay và xử lý trong thời
                    gian sớm nhất
                  </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-600 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Card>

              {/* Feature Card 3 */}
              <Card className="group cursor-default relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50  bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
                    Theo dõi tiến độ
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Cập nhật trạng thái xử lý theo thời gian thực, minh bạch
                    từng bước
                  </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Card>

              {/* Feature Card 4 */}
              <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50 cursor-default bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/30 text-orange-600 group-hover:scale-110 transition-transform shadow-sm">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">
                    An toàn & Bảo mật
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Thông tin được bảo vệ, chỉ người có quyền mới truy cập được
                  </p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-600 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Card>
            </div>
          </Reveal>
        </div>
      </Parallax>
    </section>
  );
}
