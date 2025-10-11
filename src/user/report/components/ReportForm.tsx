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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/motion";
import { FileText, Upload } from "lucide-react";

const reportTypes = [
  "Điện - Chiếu sáng",
  "Nước - Hệ thống cấp thoát nước",
  "Điều hòa - Thông gió",
  "Bàn ghế - Thiết bị",
  "Vệ sinh - Dọn dẹp",
  "An ninh - An toàn",
  "Khác",
];

const priorityLevels = [
  { value: "low", label: "Thấp", color: "text-green-500" },
  { value: "medium", label: "Trung bình", color: "text-yellow-500" },
  { value: "high", label: "Cao", color: "text-orange-500" },
  { value: "urgent", label: "Khẩn cấp", color: "text-red-500" },
];

const buildings = [
  "Tòa nhà A",
  "Tòa nhà B",
  "Tòa nhà C",
  "Khu thí nghiệm",
  "Thư viện",
  "Khu thể thao",
  "Ký túc xá",
];

export function ReportForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Report submitted");
  };

  return (
    <Reveal delay={0}>
      <Card className="lg:col-span-2 hover:shadow-xl transition-shadow">
        <CardHeader>
          <CardTitle>Thông tin báo cáo</CardTitle>
          <CardDescription>
            Vui lòng mô tả chi tiết vấn đề để chúng tôi có thể hỗ trợ tốt nhất
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullname">Họ và tên *</Label>
                <Input id="fullname" placeholder="Nguyễn Văn A" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@iuh.edu.vn"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123456789"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-id">Mã số SV/GV</Label>
                <Input id="student-id" placeholder="19123456" />
              </div>
            </div>

            {/* Report Details */}
            <div className="space-y-2">
              <Label htmlFor="report-type">Loại sự cố *</Label>
              <Select required>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Chọn loại sự cố" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="building">Tòa nhà/Khu vực *</Label>
                <Select required>
                  <SelectTrigger id="building">
                    <SelectValue placeholder="Chọn tòa nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building} value={building.toLowerCase()}>
                        {building}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Phòng/Vị trí *</Label>
                <Input id="room" placeholder="Ví dụ: P.204, Tầng 2" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Mức độ ưu tiên *</Label>
              <Select required>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <span className={level.color}>{level.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input id="title" placeholder="Tóm tắt vấn đề" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả chi tiết *</Label>
              <Textarea
                id="description"
                placeholder="Mô tả chi tiết về sự cố, thời gian phát hiện, tác động..."
                rows={6}
                required
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Hình ảnh/Tài liệu</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  className="cursor-pointer"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ: JPG, PNG, PDF (Tối đa 5MB)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full hover:scale-105 transition-transform"
              size="lg"
            >
              <FileText className=" h-4 w-4" />
              Gửi báo cáo
            </Button>
          </form>
        </CardContent>
      </Card>
    </Reveal>
  );
}
