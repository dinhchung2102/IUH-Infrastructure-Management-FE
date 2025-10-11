import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Building2, ArrowRight } from "lucide-react";
import { Stagger, Parallax } from "@/components/motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/50 py-20 md:py-28">
      <div className="container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Stagger interval={0.15}>
            <Badge variant="secondary" className="mb-4">
              <Building2 className="mr-1 h-3 w-3" />
              IUH Facilities Management
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Quản lý{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Cơ sở vật chất
              </span>
              <br />
              Thông minh & Hiệu quả
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Hệ thống quản lý và báo cáo sự cố cơ sở vật chất trường Đại học
              Công nghiệp TP.HCM. Nhanh chóng, minh bạch và dễ sử dụng.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Link to="/report">
                  <FileText className=" h-4 w-4" />
                  Báo cáo sự cố
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto hover:scale-105 transition-all"
              >
                <Link to="/about">
                  Tìm hiểu thêm
                  <ArrowRight className=" h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Stagger>
        </div>
      </div>
      <Parallax from={-10} to={10}>
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-48 bg-gradient-to-b from-primary/10 to-transparent blur-2xl" />
      </Parallax>
    </section>
  );
}
