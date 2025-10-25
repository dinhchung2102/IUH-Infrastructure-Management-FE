import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion";

export function AboutCTASection() {
  return (
    <section className="container py-16">
      <Reveal>
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-2xl transition-shadow">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Thông tin liên hệ
            </h2>
            <div className="mb-6 space-y-3 text-muted-foreground">
              <p className="text-lg font-semibold text-foreground">
                Phòng Quản Trị
              </p>
              <p>Tầng trệt nhà B, Trường Đại học Công nghiệp TP.HCM</p>
              <p>12 Nguyễn Văn Bảo, P.1, Q. Gò Vấp, TP.HCM</p>
              <p className="text-primary font-semibold">
                Điện thoại: (028) 38940390 – số nội bộ 140
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
              >
                Liên hệ ngay
              </a>
              <a
                href="tel:+842838940390"
                className="inline-flex h-10 items-center justify-center rounded-md border border-primary px-6 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:scale-105"
              >
                Gọi điện
              </a>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}
