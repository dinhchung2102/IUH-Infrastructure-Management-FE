import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const categories = [
  { id: "classroom", label: "Phòng học" },
  { id: "lab", label: "Phòng thí nghiệm" },
  { id: "library", label: "Thư viện" },
  { id: "auditorium", label: "Hội trường" },
  { id: "sports", label: "Thể thao" },
  { id: "cafeteria", label: "Căng tin" },
];

const buildings = [
  { id: "a", label: "Tòa A" },
  { id: "b", label: "Tòa B" },
  { id: "c", label: "Tòa C" },
  { id: "d", label: "Tòa D" },
  { id: "e", label: "Tòa E" },
];

const statuses = [
  { id: "available", label: "Đang hoạt động" },
  { id: "maintenance", label: "Bảo trì" },
  { id: "unavailable", label: "Không khả dụng" },
];

export function FacilitiesFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="size-4" />
          Bộ lọc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Loại cơ sở</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox id={category.id} />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Buildings */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Tòa nhà</Label>
          <div className="space-y-2">
            {buildings.map((building) => (
              <div key={building.id} className="flex items-center space-x-2">
                <Checkbox id={`building-${building.id}`} />
                <label
                  htmlFor={`building-${building.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {building.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Trạng thái</Label>
          <div className="space-y-2">
            {statuses.map((status) => (
              <div key={status.id} className="flex items-center space-x-2">
                <Checkbox id={`status-${status.id}`} />
                <label
                  htmlFor={`status-${status.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {status.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" size="sm">
            Xóa bộ lọc
          </Button>
          <Button className="flex-1" size="sm">
            Áp dụng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
