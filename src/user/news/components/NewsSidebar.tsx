import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tag, Calendar } from "lucide-react";

const categories = [
  { name: "Tất cả", count: 24 },
  { name: "Bảo trì", count: 8 },
  { name: "Nâng cấp", count: 6 },
  { name: "Thông báo", count: 10 },
];

const featuredNews = [
  {
    id: 1,
    title: "Bảo trì hệ thống điện khu A vào cuối tuần",
    date: "5 tháng 10, 2025",
  },
  {
    id: 2,
    title: "Hoàn thành nâng cấp phòng thí nghiệm C204",
    date: "3 tháng 10, 2025",
  },
  {
    id: 3,
    title: "Thông báo tạm ngưng cung cấp nước khu B",
    date: "1 tháng 10, 2025",
  },
];

export function NewsSidebar() {
  return (
    <aside className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant="ghost"
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {category.name}
                </span>
                <Badge variant="secondary">{category.count}</Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Tin nổi bật</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {featuredNews.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="space-y-1">
                <p className="cursor-pointer text-sm font-medium leading-tight hover:text-primary">
                  {item.title}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
}
