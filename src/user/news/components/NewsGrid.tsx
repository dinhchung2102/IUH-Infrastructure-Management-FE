import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import { Calendar, ArrowRight } from "lucide-react";

const news = [
  {
    id: 1,
    title: "Bảo trì hệ thống điện khu A vào cuối tuần",
    excerpt:
      "Chúng tôi sẽ tiến hành bảo trì định kỳ hệ thống điện tại khu A vào thứ 7 tuần này. Vui lòng chuẩn bị trước...",
    date: "5 tháng 10, 2025",
    category: "Bảo trì",
    status: "Đang tiến hành",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Hoàn thành nâng cấp phòng thí nghiệm C204",
    excerpt:
      "Phòng thí nghiệm C204 đã được nâng cấp hoàn toàn với các thiết bị hiện đại nhất. Sinh viên có thể sử dụng từ thứ 2...",
    date: "3 tháng 10, 2025",
    category: "Nâng cấp",
    status: "Hoàn thành",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Thông báo tạm ngưng cung cấp nước khu B",
    excerpt:
      "Do công tác sửa chữa đường ống, khu B sẽ tạm ngưng cung cấp nước từ 8h-12h ngày 7/10. Xin lỗi vì sự bất tiện này...",
    date: "1 tháng 10, 2025",
    category: "Thông báo",
    status: "Sắp diễn ra",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Cải tạo khu vực sân vườn trước tòa nhà chính",
    excerpt:
      "Dự án cải tạo cảnh quan sân vườn sẽ bắt đầu từ tuần sau, dự kiến hoàn thành trong 3 tuần. Khu vực sẽ được...",
    date: "28 tháng 9, 2025",
    category: "Nâng cấp",
    status: "Đang lên kế hoạch",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Lắp đặt hệ thống camera an ninh mới",
    excerpt:
      "Hệ thống camera giám sát an ninh mới đã được lắp đặt tại các khu vực công cộng, nâng cao độ an toàn...",
    date: "25 tháng 9, 2025",
    category: "Nâng cấp",
    status: "Hoàn thành",
    image:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Bảo trì thang máy tòa nhà A định kỳ",
    excerpt:
      "Thang máy các tầng của tòa nhà A sẽ được bảo trì định kỳ vào sáng thứ 3. Vui lòng sử dụng cầu thang bộ...",
    date: "22 tháng 9, 2025",
    category: "Bảo trì",
    status: "Hoàn thành",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Hoàn thành":
      return "default";
    case "Đang tiến hành":
      return "secondary";
    case "Sắp diễn ra":
      return "outline";
    default:
      return "outline";
  }
};

export function NewsGrid() {
  return (
    <div className="lg:col-span-3">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {news.length} bài viết
        </p>
        <Button variant="outline" size="sm">
          Mới nhất
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {news.map((item, index) => (
          <Reveal key={item.id} delay={index * 0.1}>
            <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="aspect-video overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform hover:scale-110"
                />
              </div>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg">
                  {item.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {item.date}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    Đọc thêm
                    <ArrowRight className=" h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Trang trước
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="default" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  );
}
