import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export function ContactHeroSection() {
  return (
    <section className="bg-gradient-to-b from-background to-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            <MessageSquare className="mr-1 h-3 w-3" />
            Liên hệ
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Chúng tôi sẵn sàng{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              hỗ trợ bạn
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Liên hệ với chúng tôi qua các kênh bên dưới hoặc gửi tin nhắn trực
            tiếp. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </div>
    </section>
  );
}
