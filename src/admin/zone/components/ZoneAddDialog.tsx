"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createZone, updateZone } from "../api/zone.api";
import { getBuildings } from "../../building-area/api/building.api";
import { getAreas } from "../../building-area/api/area.api";

interface ZoneAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  zone?: any;
}

export function ZoneAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  zone,
}: ZoneAddDialogProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    location: "",
    zoneType: "FUNCTIONAL",
    floorLocation: "",
  });

  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<"area" | "building" | null>(
    null
  );

  // 🏢 Load danh sách area + building
  useEffect(() => {
    if (open) fetchLocations();
  }, [open]);

  const fetchLocations = async () => {
    try {
      const [areasRes, buildingsRes] = await Promise.all([
        getAreas({}),
        getBuildings({}),
      ]);

      const areas = (areasRes?.data?.areas || []).map((a: any) => ({
        _id: a._id,
        name: a.name,
        campus: a.campus?.name,
        type: "area",
      }));

      const buildings = (buildingsRes?.data?.buildings || []).map((b: any) => ({
        _id: b._id,
        name: b.name,
        campus: b.campus?.name,
        area: b.area?.name,
        type: "building",
      }));

      setLocations([...areas, ...buildings]);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khu vực / tòa nhà:", err);
      toast.error("Không thể tải danh sách khu vực hoặc tòa nhà.");
    }
  };

  // ✏️ Khi chỉnh sửa
  useEffect(() => {
    if (mode === "edit" && zone) {
      const type = zone.building ? "building" : "area";
      setSelectedType(type);

      setForm({
        name: zone.name || "",
        description: zone.description || "",
        status: zone.status || "ACTIVE",
        location:
          zone.building?._id ||
          zone.area?._id ||
          zone.building ||
          zone.area ||
          "",
        zoneType: zone.zoneType || "FUNCTIONAL",
        floorLocation:
          type === "building" && zone.floorLocation
            ? zone.floorLocation.toString()
            : "",
      });
    } else {
      setForm({
        name: "",
        description: "",
        status: "ACTIVE",
        location: "",
        zoneType: "FUNCTIONAL",
        floorLocation: "",
      });
      setSelectedType(null);
    }
  }, [mode, zone, open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectLocation = (id: string) => {
    const selected = locations.find((l) => l._id === id);
    setSelectedType(selected?.type || null);
    setForm((prev) => ({
      ...prev,
      location: id,
      // 🧹 Reset tầng nếu chọn Area
      floorLocation: selected?.type === "area" ? "" : prev.floorLocation,
    }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Tên zone là bắt buộc.");
      return false;
    }
    if (!form.location.trim()) {
      toast.error("Vui lòng chọn khu vực hoặc tòa nhà.");
      return false;
    }
    if (
      selectedType === "building" &&
      form.floorLocation &&
      isNaN(Number(form.floorLocation))
    ) {
      toast.error("Tầng phải là một số hợp lệ.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload: any = {
        name: form.name.trim(),
        description: form.description.trim(),
        status: form.status,
        zoneType: form.zoneType,
      };

      if (selectedType === "area") payload.area = form.location;
      if (selectedType === "building") {
        payload.building = form.location;
        if (form.floorLocation)
          payload.floorLocation = Number(form.floorLocation);
      }

      console.log("📤 Payload gửi lên:", payload);

      const res =
        mode === "edit" && zone?._id
          ? await updateZone(zone._id, payload)
          : await createZone(payload);

      if (res?.success) {
        toast.success(
          mode === "edit"
            ? "Cập nhật zone thành công!"
            : "Thêm zone thành công!"
        );
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Thao tác không thành công.");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lưu zone:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi lưu zone.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa Zone" : "Thêm Zone mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin khu vực trong hệ thống."
              : "Điền đầy đủ thông tin để tạo zone mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Tên zone */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên Zone</Label>
            <Input
              id="name"
              placeholder="VD: Nhà vệ sinh H1 hoặc Phòng kỹ thuật"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              placeholder="VD: Khu vực dịch vụ hoặc chức năng"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Area / Building */}
          <div className="space-y-2">
            <Label>Khu vực / Tòa nhà</Label>
            <Select
              value={form.location}
              onValueChange={(val) => handleSelectLocation(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khu vực hoặc tòa nhà" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  — Khu vực —
                </div>
                {locations
                  .filter((l) => l.type === "area")
                  .map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.name} {a.campus ? `(${a.campus})` : ""}
                    </SelectItem>
                  ))}

                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  — Tòa nhà —
                </div>
                {locations
                  .filter((l) => l.type === "building")
                  .map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.name}{" "}
                      {b.area
                        ? `(${b.area})`
                        : b.campus
                        ? `(${b.campus})`
                        : ""}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Zone Type */}
          <div className="space-y-2">
            <Label>Loại Zone</Label>
            <Select
              value={form.zoneType}
              onValueChange={(val) => handleChange("zoneType", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FUNCTIONAL">Chức năng (FUNCTIONAL)</SelectItem>
                <SelectItem value="TECHNICAL">Kỹ thuật (TECHNICAL)</SelectItem>
                <SelectItem value="SERVICE">Dịch vụ (SERVICE)</SelectItem>
                <SelectItem value="PUBLIC">Công cộng (PUBLIC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Floor (chỉ hiển thị nếu là building) */}
          {selectedType === "building" && (
            <div className="space-y-2">
              <Label htmlFor="floorLocation">Tầng</Label>
              <Input
                id="floorLocation"
                placeholder="VD: 1"
                value={form.floorLocation}
                onChange={(e) =>
                  handleChange("floorLocation", e.target.value)
                }
              />
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={form.status}
              onValueChange={(val) => handleChange("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Cập nhật" : "Thêm Zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
