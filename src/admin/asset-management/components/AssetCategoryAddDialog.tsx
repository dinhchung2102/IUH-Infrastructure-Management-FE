"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { AssetCategoryResponse } from "@/admin/asset-management/api/assetCategories.api";
import { createAssetCategory, updateAssetCategory } from "../api/assetCategories.api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  category?: any;
}

export function AssetCategoryAddDialog({
  open,
  onOpenChange,
  onSuccess,
  mode = "add",
  category,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === "edit" && category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        status: category.status || "ACTIVE",
      });
    } else {
      setForm({ name: "", description: "", image: "", status: "ACTIVE" });
    }
  }, [category, mode, open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Tên danh mục là bắt buộc.");

    try {
      setLoading(true);
      const payload: Partial<AssetCategoryResponse> = {
        name: form.name,
        description: form.description,
        image: form.image,
        status: form.status as "ACTIVE" | "INACTIVE", // ✅ ép kiểu rõ ràng
        };


      const res =
        mode === "edit" && category?._id
          ? await updateAssetCategory(category._id, payload)
          : await createAssetCategory(payload);

      if (res?.success) {
        toast.success(
          mode === "edit" ? "Cập nhật danh mục thành công!" : "Thêm danh mục thành công!"
        );
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(res?.message || "Thao tác không thành công.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi lưu danh mục.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Cập nhật thông tin danh mục thiết bị."
              : "Điền thông tin để thêm danh mục mới."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Tên danh mục</Label>
            <Input
              placeholder="VD: Thiết bị điện tử"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea
              placeholder="Mô tả chi tiết về danh mục"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Ảnh (URL)</Label>
            <Input
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => handleChange("image", e.target.value)}
            />
          </div>

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
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              {mode === "edit" ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
