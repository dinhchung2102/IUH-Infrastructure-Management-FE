import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Calendar,
  Info,
  Building2,
  FlaskConical,
  BookOpen,
  Presentation,
} from "lucide-react";
import { AnimatedCard } from "@/components/motion";

const facilities = [
  {
    id: 1,
    name: "Phòng A101",
    type: "Phòng học",
    building: "Tòa A",
    floor: "Tầng 1",
    capacity: 60,
    status: "available",
    icon: Building2,
    amenities: ["Máy chiếu", "Điều hòa", "Bảng thông minh"],
  },
  {
    id: 2,
    name: "Lab Điện tử",
    type: "Phòng thí nghiệm",
    building: "Tòa B",
    floor: "Tầng 3",
    capacity: 30,
    status: "available",
    icon: FlaskConical,
    amenities: ["Thiết bị thí nghiệm", "Máy tính", "Điều hòa"],
  },
  {
    id: 3,
    name: "Thư viện trung tâm",
    type: "Thư viện",
    building: "Tòa C",
    floor: "Tầng 1-3",
    capacity: 200,
    status: "available",
    icon: BookOpen,
    amenities: ["Khu đọc sách", "Khu tự học", "WiFi tốc độ cao"],
  },
  {
    id: 4,
    name: "Hội trường lớn",
    type: "Hội trường",
    building: "Tòa D",
    floor: "Tầng 1",
    capacity: 500,
    status: "maintenance",
    icon: Presentation,
    amenities: ["Hệ thống âm thanh", "Màn hình LED", "Điều hòa"],
  },
  {
    id: 5,
    name: "Phòng B205",
    type: "Phòng học",
    building: "Tòa B",
    floor: "Tầng 2",
    capacity: 45,
    status: "available",
    icon: Building2,
    amenities: ["Máy chiếu", "Điều hòa"],
  },
  {
    id: 6,
    name: "Lab Mạng máy tính",
    type: "Phòng thí nghiệm",
    building: "Tòa E",
    floor: "Tầng 4",
    capacity: 40,
    status: "available",
    icon: FlaskConical,
    amenities: ["40 máy tính", "Switch mạng", "Điều hòa"],
  },
];

const statusConfig = {
  available: {
    label: "Đang hoạt động",
    variant: "default" as const,
    color: "bg-green-500/10 text-green-700 dark:text-green-400",
  },
  maintenance: {
    label: "Bảo trì",
    variant: "secondary" as const,
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  },
  unavailable: {
    label: "Không khả dụng",
    variant: "destructive" as const,
    color: "bg-red-500/10 text-red-700 dark:text-red-400",
  },
};

export function FacilitiesGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Danh sách cơ sở vật chất</h2>
          <p className="text-muted-foreground">
            Tìm thấy {facilities.length} kết quả
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {facilities.map((facility, index) => {
          const Icon = facility.icon;
          const status =
            statusConfig[facility.status as keyof typeof statusConfig];

          return (
            <AnimatedCard key={facility.id} delay={index * 0.05}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {facility.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {facility.type}
                        </p>
                      </div>
                    </div>
                    <Badge className={status.color}>{status.label}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-4" />
                      <span>
                        {facility.building} - {facility.floor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4" />
                      <span>{facility.capacity} chỗ ngồi</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Tiện nghi:</p>
                    <div className="flex flex-wrap gap-2">
                      {facility.amenities.map((amenity) => (
                        <Badge key={amenity} variant="outline">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Info className="size-4 mr-1" />
                      Chi tiết
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      disabled={facility.status !== "available"}
                    >
                      <Calendar className="size-4 mr-1" />
                      Đặt phòng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          );
        })}
      </div>
    </div>
  );
}
