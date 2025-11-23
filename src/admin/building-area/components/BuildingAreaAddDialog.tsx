"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Loader2 } from "lucide-react";
import { createBuilding, updateBuilding } from "../api/building.api";
import { createArea, updateArea } from "../api/area.api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  item?: any;
  campuses: any[];
}

export function BuildingAreaAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  item,
  campuses = [],
}: Props) {
  const defaultForm = {
    name: "",
    status: "ACTIVE",
    description: "",
    floor: "",
    campus: "",
    zoneType: "FUNCTIONAL",
    type: "BUILDING",
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
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, mode, item]);

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

      toast.success(mode === "edit" ? "Cập nhật thành công" : "Thêm mới thành công");
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {mode === "edit" ? "Cập nhật" : "Thêm mới"}{" "}
            {form.type === "BUILDING" ? "Tòa nhà" : "Khu vực ngoài trời"}
          </DialogTitle>
          <DialogDescription className="text-gray-500 mt-1">
            Nhập thông tin chi tiết
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 mt-4">
  {/* Loại */}
  <div>
    <Label>Loại</Label>
    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
      <SelectTrigger className="w-full mt-1">
        <SelectValue placeholder="Chọn loại" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="BUILDING">Tòa nhà</SelectItem>
        <SelectItem value="AREA">Khu vực ngoài trời</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Tên */}
  <div>
    <Label>Tên</Label>
    <Input
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
      placeholder="Nhập tên"
      className="mt-1"
    />
  </div>

  {/* Số tầng / Mô tả */}
  {form.type === "BUILDING" ? (
    <div>
      <Label>Số tầng</Label>
      <Input
        type="number"
        value={form.floor}
        onChange={(e) => setForm({ ...form, floor: e.target.value })}
        placeholder="Nhập số tầng"
        className="mt-1"
      />
    </div>
  ) : (
    <>
      <div>
        <Label>Mô tả</Label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Nhập mô tả"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Zone Type</Label>
        <Select value={form.zoneType} onValueChange={(v) => setForm({ ...form, zoneType: v })}>
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Chọn zone type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FUNCTIONAL">Chức năng (FUNCTIONAL)</SelectItem>
            <SelectItem value="TECHNICAL">Kỹ thuật (TECHNICAL)</SelectItem>
            <SelectItem value="SERVICE">Dịch vụ (SERVICE)</SelectItem>
            <SelectItem value="PUBLIC">Công cộng (PUBLIC)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )}

  {/* Cơ sở */}
  <div>
    <Label>Cơ sở</Label>
    <Select value={form.campus} onValueChange={(v) => setForm({ ...form, campus: v })}>
      <SelectTrigger className="w-full mt-1">
        <SelectValue placeholder="Chọn cơ sở" />
      </SelectTrigger>
      <SelectContent>
        {campuses.length > 0 ? (
          campuses.map((c) => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)
        ) : (
          <SelectItem value="" disabled>Không có dữ liệu</SelectItem>
        )}
      </SelectContent>
    </Select>
  </div>

  {/* Trạng thái */}
  <div>
    <Label>Trạng thái</Label>
    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
      <SelectTrigger className="w-full mt-1">
        <SelectValue placeholder="Chọn trạng thái" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ACTIVE">Hoạt động</SelectItem>
        <SelectItem value="INACTIVE">Ngừng</SelectItem>
        <SelectItem value="UNDERMAINTENANCE">Bảo trì</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>


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
      </DialogContent>
    </Dialog>
  );
}
