import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/motion";
import { Clock, Building2 } from "lucide-react";

const departments = [
  { name: "Phòng Quản lý Cơ sở vật chất", ext: "123" },
  { name: "Phòng Kỹ thuật", ext: "456" },
  { name: "Phòng Hành chính", ext: "789" },
];

export function ContactSidebar() {
  return (
    <div className="space-y-6">
      {/* Working Hours */}
      <Reveal delay={0.2}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Giờ làm việc</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thứ 2 - Thứ 6:</span>
              <span className="font-medium">7:30 - 17:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thứ 7:</span>
              <span className="font-medium">8:00 - 12:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chủ nhật:</span>
              <span className="font-medium">Nghỉ</span>
            </div>
          </CardContent>
        </Card>
      </Reveal>

      {/* Departments */}
      <Reveal delay={0.3}>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">Các phòng ban</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.map((dept, index) => (
              <div key={index}>
                {index > 0 && <Separator className="mb-3" />}
                <div>
                  <p className="font-medium">{dept.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Nội bộ: {dept.ext}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </Reveal>

      {/* Emergency */}
      <Reveal delay={0.4}>
        <Card className="border-destructive/50 bg-destructive/5 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">
              Trường hợp khẩn cấp
            </CardTitle>
            <CardDescription>Gọi ngay hotline 24/7</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="tel:+842838942223"
              className="text-xl font-bold text-destructive hover:underline"
            >
              (028) 3894 2223
            </a>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
