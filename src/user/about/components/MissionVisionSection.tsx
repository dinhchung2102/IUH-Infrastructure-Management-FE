import { Target, Eye } from "lucide-react";

export function MissionVisionSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container">
        {/* Sứ mệnh Section */}
        <div className="mb-20">
          <div>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Nội dung Sứ mệnh */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 uppercase bg-clip-text text-transparent">
                    Sứ mệnh
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Tham mưu và giúp Hiệu trưởng trong việc quản lý, tổng hợp, đề
                  xuất ý kiến, tổ chức thực hiện việc quản lý toàn bộ hệ thống
                  của trường về công tác quản trị, quản lý toàn bộ thiết bị của
                  Trường, quản lý công tác đầu tư xây dựng.
                </p>
              </div>

              {/* Hình ảnh Sứ mệnh */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200/50 dark:border-blue-800/50 overflow-hidden shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
                        <Target className="w-10 h-10 text-blue-600" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Quản lý toàn diện
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tầm nhìn Section */}
        <div>
          <div>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Hình ảnh Tầm nhìn */}
              <div className="relative order-2 lg:order-1">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/50 dark:border-emerald-800/50 overflow-hidden shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center">
                        <Eye className="w-10 h-10 text-emerald-600" />
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        Tầm nhìn tương lai
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nội dung Tầm nhìn */}
              <div className="space-y-6 order-1 lg:order-2">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 uppercase to-teal-600 bg-clip-text text-transparent">
                    Tầm nhìn
                  </h2>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Trở thành đơn vị quản lý cơ sở hạ tầng tiên tiến, ứng dụng
                  công nghệ thông minh trong vận hành và bảo trì. Xây dựng hệ
                  thống quản lý toàn diện, hiệu quả và thân thiện với người
                  dùng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
