import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export function AboutHeroSection() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Building2 className="mr-1 h-3 w-3" />
            Về chúng tôi
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Quản lý Cơ sở vật chất
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Trường Đại học Công nghiệp TP.HCM
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Chúng tôi cam kết cung cấp môi trường học tập và làm việc tốt nhất
            thông qua việc quản lý, bảo trì và nâng cấp cơ sở vật chất một cách
            chuyên nghiệp và hiệu quả.
          </p>
        </div>
      </div>
    </section>
  );
}
