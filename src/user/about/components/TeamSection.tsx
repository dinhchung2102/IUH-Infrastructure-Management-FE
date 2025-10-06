import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/motion";

const team = [
  {
    role: "Quản lý",
    description: "Giám sát và điều phối toàn bộ hoạt động",
  },
  {
    role: "Kỹ thuật",
    description: "Xử lý sự cố và bảo trì thiết bị",
  },
  {
    role: "Hỗ trợ",
    description: "Tiếp nhận và tư vấn cho người dùng",
  },
];

export function TeamSection() {
  return (
    <section className="border-t bg-muted/30 py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Đội ngũ của chúng tôi</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Đội ngũ chuyên nghiệp, tận tâm và luôn sẵn sàng hỗ trợ
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {team.map((member, index) => (
            <Reveal key={index} delay={index * 0.15}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{member.role}</CardTitle>
                  <CardDescription>{member.description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
