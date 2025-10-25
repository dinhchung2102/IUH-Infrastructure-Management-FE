"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { createAsset, updateAsset } from "../api/asset.api";
import { getAssetTypes } from "../api/assetType.api";
import { getAssetCategories } from "@/admin/asset-management/api/assetCategories.api";
import { getAreas } from "@/admin/building-area/api/area.api";
import { getZones } from "../../zone/api/zone.api";

interface AssetAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  asset?: any;
}

export function AssetAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  asset,
}: AssetAddDialogProps) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    status: "IN_USE",
    description: "",
    assetType: "",
    assetCategory: "",
    zone: "",
    area: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  // Load dữ liệu dropdown
  useEffect(() => {
    if (open) {
      fetchDropdowns();
    }
  }, [open]);

  const fetchDropdowns = async () => {
    try {
      const [typeRes, catRes, zoneRes, areaRes] = await Promise.all([
        getAssetTypes(),
        getAssetCategories(),
        getZones(),
        getAreas(),
      ]);

      setTypes(typeRes?.data?.assetTypes || []);
      setCategories(catRes?.data?.categories || []);
      setZones(zoneRes?.data?.zones || []);
      setAreas(areaRes?.data?.areas || []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu chọn:", err);
      toast.error("Không thể tải danh sách chọn.");
    }
  };

  // Khi edit -> nạp lại form
  useEffect(() => {
    if (mode === "edit" && asset) {
      setForm({
        name: asset.name || "",
        code: asset.code || "",
        status: asset.status || "IN_USE",
        description: asset.description || "",
        assetType: asset.assetType?._id || asset.assetType || "",
        assetCategory: asset.assetCategory?._id || asset.assetCategory || "",
        zone: asset.zone?._id || "",
        area: asset.area?._id || "",
        image: asset.image || "",
      });
    } else {
      setForm({
        name: "",
        code: "",
        status: "IN_USE",
        description: "",
        assetType: "",
        assetCategory: "",
        zone: "",
        area: "",
        image: "",
      });
    }
  }, [mode, asset, open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      toast.error("Tên thiết bị là bắt buộc.");
      return false;
    }
    if (!form.assetType) {
      toast.error("Vui lòng chọn loại thiết bị.");
      return false;
    }
    if (!form.assetCategory) {
      toast.error("Vui lòng chọn danh mục thiết bị.");
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
        code: form.code.trim(),
        description: form.description.trim(),
        status: form.status,
        assetType: form.assetType,
        assetCategory: form.assetCategory,
        image: form.image,
      };

      // Nếu chọn khu vực hoặc area
      if (form.zone) payload.zone = form.zone;
      if (form.area) payload.area = form.area;

      console.log("📤 Sending payload:", payload);

      const res =
        mode === "edit" && asset?._id
          ? await updateAsset(asset._id, payload)
          : await createAsset(payload);

      if (res?.success) {
        toast.success(
          mode === "edit" ? "Cập nhật thiết bị thành công!" : "Thêm thiết bị thành công!"
        );
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Thao tác không thành công.");
      }
    } catch (err: any) {
      console.error("❌ Lỗi khi lưu thiết bị:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Có lỗi xảy ra khi lưu thiết bị.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa thiết bị" : "Thêm thiết bị mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin thiết bị trong hệ thống."
              : "Điền đầy đủ thông tin để thêm thiết bị mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Tên thiết bị */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên thiết bị</Label>
            <Input
              id="name"
              placeholder="VD: Máy chiếu Epson EB-X06"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Mã thiết bị */}
          <div className="space-y-2">
            <Label htmlFor="code">Mã thiết bị</Label>
            <Input
              id="code"
              placeholder="VD: ASSET001"
              value={form.code}
              onChange={(e) => handleChange("code", e.target.value)}
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết về thiết bị"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Loại & Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loại thiết bị</Label>
              <Select
                value={form.assetType}
                onValueChange={(val) => handleChange("assetType", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Danh mục thiết bị</Label>
              <Select
                value={form.assetCategory}
                onValueChange={(val) => handleChange("assetCategory", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Khu vực hoặc Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Khu vực (Zone)</Label>
              <Select
                value={form.zone}
                onValueChange={(val) => handleChange("zone", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z._id} value={z._id}>
                      {z.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Khu vực (Area)</Label>
              <Select
                value={form.area}
                onValueChange={(val) => handleChange("area", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a._id} value={a._id}>
                      {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trạng thái */}
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
                <SelectItem value="IN_USE">Đang sử dụng</SelectItem>
                <SelectItem value="MAINTENANCE">Đang bảo trì</SelectItem>
                <SelectItem value="BROKEN">Hư hỏng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ảnh */}
          <div className="space-y-2">
            <Label>Ảnh thiết bị (URL)</Label>
            <Input
              placeholder="https://example.com/device.jpg"
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
          </div>

          {/* Buttons */}
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === "edit" ? "Cập nhật" : "Thêm thiết bị"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
