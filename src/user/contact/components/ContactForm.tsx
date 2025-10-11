import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/motion";
import { Mail } from "lucide-react";

export function ContactForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <Reveal delay={0}>
      <Card className="lg:col-span-2 hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Gửi tin nhắn</CardTitle>
          <CardDescription>
            Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất
            có thể
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên *</Label>
                <Input id="name" placeholder="Nguyễn Văn A" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" type="tel" placeholder="0123456789" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Tiêu đề *</Label>
              <Input id="subject" placeholder="Vấn đề cần hỗ trợ" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Nội dung *</Label>
              <Textarea
                id="message"
                placeholder="Mô tả chi tiết vấn đề của bạn..."
                rows={6}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full hover:scale-105 transition-transform"
            >
              <Mail className=" h-4 w-4" />
              Gửi tin nhắn
            </Button>
          </form>
        </CardContent>
      </Card>
    </Reveal>
  );
}
