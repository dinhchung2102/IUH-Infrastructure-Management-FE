import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export function ReportHeroSection() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            <FileText className="mr-1 h-3 w-3" />
            Báo cáo sự cố
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Báo cáo{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Sự cố
            </span>{" "}
            Cơ sở vật chất
          </h1>
          <p className="text-lg text-muted-foreground">
            Giúp chúng tôi cải thiện môi trường học tập và làm việc. Mọi báo cáo
            của bạn đều được xử lý nhanh chóng và chuyên nghiệp.
          </p>
        </div>
      </div>
    </section>
  );
}
