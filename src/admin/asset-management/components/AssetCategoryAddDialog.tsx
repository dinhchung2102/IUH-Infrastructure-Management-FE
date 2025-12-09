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
  type AssetCategoryResponse,
} from "../api/assetCategories.api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  mode?: "add" | "edit";
  category?: AssetCategoryResponse | null;
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
            <div className="relative">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {preview ? (
                <div className="relative group">
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                    <img
                      src={
                        preview.startsWith("blob:")
                          ? preview
                          : preview.startsWith("http")
                          ? preview
                          : `${import.meta.env.VITE_URL_UPLOADS}${preview}`
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Invalid+Image";
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      document.getElementById("image-upload")?.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Thay đổi ảnh
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click để chọn ảnh</span>{" "}
                      hoặc kéo thả vào đây
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, WebP (tối đa 5MB)
                    </p>
                  </div>
                </label>
              )}
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
