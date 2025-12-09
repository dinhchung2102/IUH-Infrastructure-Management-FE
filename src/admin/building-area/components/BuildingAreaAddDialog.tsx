"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Info } from "lucide-react";
import { createBuilding, updateBuilding } from "../api/building.api";
import { createArea, updateArea } from "../api/area.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  item?: any;
  campuses: any[];
  defaultType?: "BUILDING" | "AREA";
}

export function BuildingAreaAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  item,
  campuses = [],
  defaultType = "BUILDING",
}: Props) {
  const defaultForm = {
    name: "",
    status: "ACTIVE",
    description: "",
    floor: "",
    campus: "",
    zoneType: "FUNCTIONAL",
    type: defaultType,
  };

  const [form, setForm] = useState<any>(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && item) {
      setForm({
        ...defaultForm,
        ...item,
        campus: item.campus?._id || "",
        floor: item.floor?.toString() || "",
        description: item.description || "",
        zoneType: item.zoneType || "FUNCTIONAL",
        type: item.type || defaultType,
      });
    } else {
      setForm({
        ...defaultForm,
        type: defaultType,
        status: "ACTIVE", // Mặc định là ACTIVE
      });
    }
  }, [open, mode, item, defaultType]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!form.name?.trim()) {
        toast.error("Tên không được để trống");
        return;
      }
      if (!form.campus) {
        toast.error("Vui lòng chọn cơ sở");
        return;
      }
      if (form.type === "BUILDING") {
        const floorNum = Number(form.floor);
        if (isNaN(floorNum) || floorNum < 0) {
          toast.error("Vui lòng nhập số tầng hợp lệ");
          return;
        }
      } else if (form.type === "AREA") {
        if (!form.description?.trim()) {
          toast.error("Vui lòng nhập mô tả");
          return;
        }
        const validZoneTypes = ["FUNCTIONAL", "TECHNICAL", "SERVICE", "PUBLIC"];
        if (!validZoneTypes.includes(form.zoneType)) {
          toast.error("Vui lòng chọn loại zone hợp lệ");
          return;
        }
      }

      const payload: any = {
        name: form.name.trim(),
        status: form.status,
        campus: form.campus,
      };
      if (form.type === "BUILDING") payload.floor = Number(form.floor);
      if (form.type === "AREA") {
        payload.description = form.description.trim();
        payload.zoneType = form.zoneType;
      }

      if (mode === "edit" && item?._id && item.type === form.type) {
        if (form.type === "BUILDING") await updateBuilding(item._id, payload);
        else await updateArea(item._id, payload);
      } else {
        if (form.type === "BUILDING") await createBuilding(payload);
        else await createArea(payload);
      }

      toast.success(
        mode === "edit" ? "Cập nhật thành công" : "Thêm mới thành công"
      );
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Lỗi khi lưu dữ liệu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const zoneTypeDescriptions = {
    FUNCTIONAL: {
      title: "Khu vực Chức năng",
      description:
        "Khu vực được sử dụng cho các hoạt động chức năng chính của cơ sở, như phòng học, phòng làm việc, phòng họp, thư viện, v.v.",
      color: "bg-purple-100 text-purple-700 border-purple-300",
    },
    TECHNICAL: {
      title: "Khu vực Kỹ thuật",
      description:
        "Khu vực dành cho các thiết bị kỹ thuật, hệ thống cơ sở hạ tầng như phòng máy chủ, phòng điện, phòng nước, hệ thống điều hòa, v.v.",
      color: "bg-blue-100 text-blue-700 border-blue-300",
    },
    SERVICE: {
      title: "Khu vực Dịch vụ",
      description:
        "Khu vực cung cấp các dịch vụ hỗ trợ như nhà vệ sinh, phòng y tế, căn tin, khu vực đỗ xe, v.v.",
      color: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    PUBLIC: {
      title: "Khu vực Công cộng",
      description:
        "Khu vực mở cho công chúng sử dụng như sân vận động, công viên, khu vực giải trí, không gian công cộng, v.v.",
      color: "bg-green-100 text-green-700 border-green-300",
    },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`rounded-xl p-6 ${
          form.type === "AREA"
            ? "max-w-[calc(100%-2rem)] sm:max-w-[1100px]"
            : "max-w-[calc(100%-2rem)] sm:max-w-[550px]"
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {mode === "edit" ? "Cập nhật" : "Thêm mới"}{" "}
            {form.type === "BUILDING" ? "Tòa nhà" : "Khu vực ngoài trời"}
          </DialogTitle>
        </DialogHeader>

        {form.type === "AREA" ? (
          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái: Hướng dẫn ZoneType */}
            <div>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Hướng dẫn về Loại khu vực
                  </CardTitle>
                  <CardDescription>
                    Chọn loại khu vực phù hợp với mục đích sử dụng
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(zoneTypeDescriptions).map(([key, info]) => (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border ${
                        form.zoneType === key
                          ? "ring-2 ring-primary"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          className={`${info.color} border`}
                          variant="outline"
                        >
                          {info.title}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {info.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Cột phải: Form */}
            <div className="space-y-4">
              <div>
                <Label>Cơ sở</Label>
                <Select
                  value={form.campus}
                  onValueChange={(v) => setForm({ ...form, campus: v })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Chọn cơ sở" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses.length > 0 ? (
                      campuses.map((c) => (
                        <SelectItem key={c._id} value={c._id}>
                          {c.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Không có dữ liệu
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Tên và Loại khu vực trên cùng 1 hàng */}
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Label>Tên</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nhập tên"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-1">
                  <Label>Loại khu vực</Label>
                  <Select
                    value={form.zoneType}
                    onValueChange={(v) => setForm({ ...form, zoneType: v })}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Chọn loại khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FUNCTIONAL">Chức năng</SelectItem>
                      <SelectItem value="TECHNICAL">Kỹ thuật</SelectItem>
                      <SelectItem value="SERVICE">Dịch vụ</SelectItem>
                      <SelectItem value="PUBLIC">Công cộng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Mô tả</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Nhập mô tả"
                  className="mt-1"
                />
              </div>

              {/* Button thêm mới */}
              <div className="pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "edit" ? "Lưu thay đổi" : "Thêm mới"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {/* Cơ sở */}
            <div>
              <Label>Cơ sở</Label>
              <Select
                value={form.campus}
                onValueChange={(v) => setForm({ ...form, campus: v })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Chọn cơ sở" />
                </SelectTrigger>
                <SelectContent>
                  {campuses.length > 0 ? (
                    campuses.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Không có dữ liệu
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Tên và Số tầng trên cùng 1 hàng */}
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label>Tên</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nhập tên"
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label>Số tầng</Label>
                <Input
                  type="number"
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  placeholder="Nhập số"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {form.type === "BUILDING" && (
          <DialogFooter className="mt-6">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
