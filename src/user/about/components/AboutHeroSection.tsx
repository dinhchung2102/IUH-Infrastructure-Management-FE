import { Badge } from "@/components/ui/badge";
import { Building2, Users, Shield, CheckCircle2 } from "lucide-react";
import { Stagger, Parallax } from "@/components/motion";
import nhaEBackground from "@/assets/background/nhaE.png";

export function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${nhaEBackground})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-8 sm:pt-12 md:pt-16 lg:pt-18 pb-20 sm:pb-28 md:pb-32 lg:pb-40">
        <div className="mx-auto max-w-5xl">
          <Stagger interval={0.15}>
            <div className="mb-6 flex justify-center sm:justify-start">
              <Badge className="bg-primary/20 text-white border-primary/30 backdrop-blur-sm px-4 py-1.5 text-sm">
                <Building2 className="mr-1.5 h-3.5 w-3.5" />
                Office of Facilities Management
              </Badge>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl text-center sm:text-left">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Phòng Quản Trị
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Trường Đại học Công nghiệp TP.HCM
              </span>
            </h1>
            <p className="mb-8 text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed text-center sm:text-justify">
              Tham mưu và giúp Hiệu trưởng trong việc quản lý, tổng hợp, đề xuất
              ý kiến, tổ chức thực hiện việc quản lý toàn bộ hệ thống của trường
              về công tác quản trị, quản lý toàn bộ thiết bị của Trường, quản lý
              công tác đầu tư xây dựng.
            </p>
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Users className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-white font-medium">
                  40,000+ Sinh viên
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Shield className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-white font-medium">
                  1,000+ Cán bộ
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-white font-medium">
                  98% Hài lòng
                </span>
              </div>
            </div>
          </Stagger>
        </div>
      </div>
      <Parallax from={-20} to={20}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </Parallax>
    </section>
  );
}
