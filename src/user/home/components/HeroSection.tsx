import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";
import { Stagger, Parallax } from "@/components/motion";
import nhaEBackground from "@/assets/background/nhaE.png";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${nhaEBackground})` }}
        />
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/60" />
        {/* Additional gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-8 sm:pt-12 md:pt-16 lg:pt-18 pb-20 sm:pb-28 md:pb-32 lg:pb-40">
        <div className="mx-auto max-w-5xl">
          <Stagger interval={0.15}>
            {/* Badge */}
            <div className="mb-6 flex justify-center sm:justify-start">
              <Badge
                variant="secondary"
                className="bg-primary/20 text-white border-primary/30 backdrop-blur-sm px-4 py-1.5 text-sm"
              >
                <Shield className="mr-1.5 h-3.5 w-3.5" />
                Phòng quản trị trường Đại học Công Nghiệp TP.HCM
              </Badge>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl text-center sm:text-left">
              Quản lý{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Cơ sở vật chất
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                Thông minh & Hiệu quả
              </span>
            </h1>

            {/* Description */}
            <p className="mb-8 text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed text-center sm:text-left">
              Hệ thống quản lý và báo cáo sự cố cơ sở vật chất trường Đại học
              Công nghiệp TP.HCM. Giải pháp toàn diện giúp sinh viên, giảng viên
              và ban quản lý theo dõi, xử lý các vấn đề một cách{" "}
              <span className="font-semibold text-cyan-300">
                nhanh chóng, minh bạch và dễ dàng
              </span>
              .
            </p>

            {/* Features List */}
            <div className="mb-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
              <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                <span className="text-sm">Báo cáo nhanh chóng</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <span className="text-sm">Xử lý tức thì</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
                <Shield className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-sm">Minh bạch & An toàn</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-3">
              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all border-0 text-base px-6 py-3 h-auto"
              >
                <Link to="/report">
                  <FileText className="h-5 w-5" />
                  Báo cáo sự cố
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm hover:scale-105 transition-all text-base px-6 py-3 h-auto"
              >
                <Link to="/about">
                  Tìm hiểu thêm
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </Stagger>
        </div>
      </div>

      {/* Animated Background Elements */}
      <Parallax from={-20} to={20}>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </Parallax>
    </section>
  );
}
