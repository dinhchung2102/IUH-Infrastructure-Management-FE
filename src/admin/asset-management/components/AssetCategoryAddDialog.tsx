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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import {
  createAssetCategory,
  updateAssetCategory,
} from "../api/assetCategories.api";

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
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Khi mở dialog → set dữ liệu (edit hoặc add)
  useEffect(() => {
    if (mode === "edit" && category) {
      setForm({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        status: category.status || "ACTIVE",
      });
      setPreview(category.image || "");
      setFile(null);
    } else {
      setForm({ name: "", description: "", image: "", status: "ACTIVE" });
      setPreview("");
      setFile(null);
    }
  }, [category, mode, open]);

  // Cleanup preview URL khi unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 🟢 Upload & xem trước ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh (PNG, JPG, JPEG)");
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }

    setFile(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  // 🗑 Xóa ảnh
  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
    setForm((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) return toast.error("Tên danh mục là bắt buộc.");

    try {
      setLoading(true);

      let res;

      if (mode === "edit" && category?._id) {
        // 🟠 Cập nhật danh mục
        if (file) {
          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("description", form.description);
          formData.append("status", form.status);
          formData.append("image", file);
          res = await updateAssetCategory(category._id, formData);
        } else {
          const payload = {
            name: form.name,
            description: form.description,
            image: form.image, // giữ nguyên ảnh cũ
            status: form.status as "ACTIVE" | "INACTIVE",
          };
          res = await updateAssetCategory(category._id, payload);
        }
      } else {
        // 🟢 Thêm danh mục mới
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("status", form.status);
        if (file) formData.append("image", file);

        res = await createAssetCategory(formData);
      }

      if (res?.success) {
        toast.success(
          mode === "edit"
            ? "Cập nhật danh mục thành công!"
            : "Thêm danh mục thành công!"
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
          {/* Tên danh mục */}
          <div className="space-y-2">
            <Label>Tên danh mục</Label>
            <Input
              placeholder="VD: Thiết bị điện tử"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label>Mô tả</Label>
            <Textarea
              placeholder="Mô tả chi tiết về danh mục"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Upload ảnh danh mục */}
          <div className="space-y-2">
            <Label>Ảnh danh mục</Label>
            {preview ? (
              <div className="space-y-2">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click vào dấu X để xóa ảnh
                </p>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click để chọn ảnh</span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG tối đa 5MB
                </span>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
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
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
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
