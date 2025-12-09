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
import { Loader2, Plus, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type {
  NewsCategory,
  CreateNewsCategoryDto,
  UpdateNewsCategoryDto,
} from "../types/news-category.type";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!category;

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
      setImage(category.image || "");
      setImageFile(null);
      setImagePreview(category.image || "");
    } else {
      setName("");
      setDescription("");
      setImage("");
      setImageFile(null);
      setImagePreview("");
      setIsActive(true);
    }
  }, [category, open]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chọn file ảnh");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      setImageFile(file);
      // Create preview URL
      if (imagePreview && !imagePreview.startsWith("http")) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
      setImage(""); // Clear URL input when file is selected
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.startsWith("http")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setSubmitting(true);

      // Use FormData if there's a file, otherwise use regular payload
      if (imageFile) {
        const formData = new FormData();
        formData.append("name", name.trim());
        if (description.trim()) {
          formData.append("description", description.trim());
        }
        formData.append("image", imageFile);
        formData.append("isActive", isActive.toString());

        if (isEditMode) {
          await updateNewsCategory(
            category._id,
            formData as unknown as UpdateNewsCategoryDto
          );
          toast.success("Cập nhật danh mục thành công!");
        } else {
          await createNewsCategory(
            formData as unknown as CreateNewsCategoryDto
          );
          toast.success("Tạo danh mục thành công!");
        }
      } else {
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
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting category:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message ||
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
            <Label>Hình ảnh danh mục</Label>
            <div className="relative">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative group">
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                    <img
                      src={
                        imagePreview.startsWith("blob:")
                          ? imagePreview
                          : imagePreview.startsWith("http")
                          ? imagePreview
                          : `${import.meta.env.VITE_URL_UPLOADS}${imagePreview}`
                      }
                      alt="Image preview"
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
                    onClick={(e) => {
                      e.preventDefault();
                      setImageFile(null);
                      setImagePreview("");
                      setImage("");
                      const input = document.getElementById(
                        "image"
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      document.getElementById("image")?.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Thay đổi ảnh
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image"
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
