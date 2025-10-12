import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion";

const recentNews = [
  {
    title: "Bảo trì hệ thống điện khu A",
    date: "5/10/2025",
    badge: "Đang xử lý",
  },
  {
    title: "Nâng cấp phòng thí nghiệm mới",
    date: "3/10/2025",
    badge: "Hoàn thành",
  },
  {
    title: "Sửa chữa hệ thống nước",
    date: "1/10/2025",
    badge: "Hoàn thành",
  },
];

export function RecentNewsSection() {
  return (
    <section className="border-t bg-muted/50 py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Tin tức mới nhất</h2>
              <p className="text-muted-foreground">
                Cập nhật các hoạt động bảo trì và nâng cấp
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/news">
                Xem tất cả
                <ArrowRight className=" h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {recentNews.map((news, index) => (
            <Reveal key={index} delay={index * 0.2}>
              <Card className="transition-all hover:shadow-xl hover:-translate-y-2 cursor-pointer">
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge
                      variant={
                        news.badge === "Hoàn thành" ? "default" : "secondary"
                      }
                    >
                      {news.badge}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {news.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    asChild
                  >
                    <Link to="/news">
                      Chi tiết
                      <ArrowRight className=" h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
