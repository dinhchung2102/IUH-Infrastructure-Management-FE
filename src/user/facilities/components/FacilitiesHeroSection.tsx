import { Building2, Search } from "lucide-react";
import { Reveal } from "@/components/motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function FacilitiesHeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 p-4">
              <Building2 className="size-8 text-primary" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Cơ Sở Vật Chất
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Trường Đại Học IUH
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mb-8 text-lg text-muted-foreground">
              Khám phá hệ thống cơ sở vật chất hiện đại với đầy đủ trang thiết
              bị phục vụ cho hoạt động học tập và nghiên cứu
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mx-auto flex max-w-md gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm phòng học, phòng thí nghiệm..."
                  className="pl-10"
                />
              </div>
              <Button>Tìm kiếm</Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
