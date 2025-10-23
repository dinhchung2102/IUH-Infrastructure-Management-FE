import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Save } from "lucide-react";
import { toast } from "sonner";
import type { NewsCategory } from "../types/news-category.type";
import {
  createNewsCategory,
  updateNewsCategory,
} from "../api/news-category.api";

interface CreateEditNewsCategoryDialogProps {
  category: NewsCategory | null; // null = create mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateEditNewsCategoryDialog({
  category,
  open,
  onOpenChange,
  onSuccess,
}: CreateEditNewsCategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setImage(category.image || "");
      setIsActive(category.isActive);
    } else {
      setName("");
      setDescription("");
      setImage("");
      setIsActive(true);
    }
  }, [category, open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        image: image.trim() || undefined,
        isActive,
      };

      if (isEditMode) {
        await updateNewsCategory(category._id, payload);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createNewsCategory(payload);
        toast.success("Tạo danh mục thành công!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting category:", error);
      toast.error(
        error.response?.data?.message ||
          `Không thể ${isEditMode ? "cập nhật" : "tạo"} danh mục`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Save className="h-5 w-5" />
                Chỉnh sửa danh mục
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Tạo danh mục mới
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin danh mục tin tức"
              : "Tạo danh mục tin tức mới cho hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên danh mục <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nhập tên danh mục..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              {name.length}/100 ký tự
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả danh mục..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white"
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {description.length}/500 ký tự
            </p>
          </div>

          {/* Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Đường dẫn hình ảnh</Label>
            <Input
              id="image"
              placeholder="/uploads/image.jpg hoặc https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="bg-white"
            />
            {image && (
              <div className="mt-2">
                <img
                  src={
                    image.startsWith("http")
                      ? image
                      : `${import.meta.env.VITE_URL_UPLOADS}${image}`
                  }
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/400x300?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base cursor-pointer">
                Trạng thái hoạt động
              </Label>
              <p className="text-sm text-muted-foreground">
                Danh mục có hiển thị công khai hay không
              </p>
            </div>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang {isEditMode ? "cập nhật" : "tạo"}...
              </>
            ) : (
              <>
                {isEditMode ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Cập nhật
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo mới
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
