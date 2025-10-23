import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ArrowRight,
  Clock,
  CheckCircle2,
  Shield,
} from "lucide-react";
import { Stagger, Parallax } from "@/components/motion";
import { Link } from "react-router-dom";
import nhaEBackground from "@/assets/background/nhaE.png";

export function ReportHeroSection() {
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
                <FileText className="mr-1.5 h-3.5 w-3.5" />
                Báo cáo sự cố
              </Badge>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl text-center sm:text-left">
              Báo cáo{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Sự cố
              </span>{" "}
              Cơ sở vật chất
            </h1>
            <p className="mb-8 text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed text-center sm:text-left">
              Giúp chúng tôi cải thiện môi trường học tập và làm việc. Mọi báo
              cáo của bạn đều được xử lý nhanh chóng và chuyên nghiệp.
            </p>
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Clock className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-white font-medium">
                  Xử lý nhanh
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-white font-medium">
                  Theo dõi tiến độ
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <Shield className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-white font-medium">
                  Bảo mật thông tin
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-4">
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all border-0 text-base px-6 py-3 h-auto">
                <FileText className="h-5 w-5" />
                <Link to="/report">Báo cáo ngay</Link>
              </Button>
              <Button className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm hover:scale-105 transition-all text-base px-6 py-3 h-auto">
                <Link to="/about">Tìm hiểu thêm</Link>
                <ArrowRight className="h-5 w-5" />
              </Button>
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
