import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion";

export function AboutCTASection() {
  return (
    <section className="container py-16">
      <Reveal>
        <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-2xl transition-shadow">
          <CardContent className="p-12 text-center">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Cần hỗ trợ thêm thông tin?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Liên hệ với chúng tôi để được tư vấn và giải đáp mọi thắc mắc
            </p>
            <a
              href="/contact"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
            >
              Liên hệ ngay
            </a>
          </CardContent>
        </Card>
      </Reveal>
    </section>
  );
}
