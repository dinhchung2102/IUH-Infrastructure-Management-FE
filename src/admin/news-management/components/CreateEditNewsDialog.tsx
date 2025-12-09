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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { News, NewsStatus } from "../types/news.type";
import { createNews, updateNews } from "../api/news.api";
import { getNewsCategories } from "@/admin/news-category-management/api/news-category.api";
import type { NewsCategory } from "@/admin/news-category-management/types/news-category.type";
import { RichTextEditor } from "@/components/RichTextEditor";

interface CreateEditNewsDialogProps {
  news: News | null; // null = create mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateEditNewsDialog({
  news,
  open,
  onOpenChange,
  onSuccess,
}: CreateEditNewsDialogProps) {
  // Get user from localStorage
  const getUserId = () => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount && storedAccount !== "undefined") {
      try {
        const account = JSON.parse(storedAccount);
        return account._id;
      } catch (error) {
        console.error("Failed to parse account data:", error);
      }
    }
    return null;
  };

  const getFullName = () => {
    const storedAccount = localStorage.getItem("account");
    if (storedAccount && storedAccount !== "undefined") {
      try {
        const account = JSON.parse(storedAccount);
        return account.fullName || "";
      } catch (error) {
        console.error("Failed to parse account data:", error);
      }
    }
    return "";
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<NewsStatus>("DRAFT" as NewsStatus);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!news;

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getNewsCategories({
          isActive: true,
          limit: 100,
        });
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Không thể tải danh sách danh mục");
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setDescription(news.description);
      // Get author name from news object
      if (typeof news.author === "object" && news.author.fullName) {
        setAuthorName(news.author.fullName);
      } else if (typeof news.author === "string") {
        // If author is just ID, try to get from localStorage as fallback
        setAuthorName(getFullName());
      } else {
        setAuthorName(getFullName());
      }
      setThumbnail(news.thumbnail);
      setThumbnailFile(null);
      setThumbnailPreview(news.thumbnail);
      const contentStr =
        typeof news.content === "string"
          ? news.content
          : JSON.stringify(news.content);
      setContent(contentStr);
      setStatus(news.status);
      setCategory(typeof news.category === "string" ? news.category : "");
    } else {
      setTitle("");
      setDescription("");
      setAuthorName(getFullName());
      setThumbnail("");
      setThumbnailFile(null);
      setThumbnailPreview("");
      setContent("");
      setStatus("DRAFT" as NewsStatus);
      setCategory("");
    }
  }, [news, open]);

  // Handle thumbnail file selection
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setThumbnailFile(file);
      // Create preview URL
      if (thumbnailPreview && !thumbnailPreview.startsWith("http")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview && !thumbnailPreview.startsWith("http")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    if (!thumbnailFile && !thumbnail.trim()) {
      toast.error("Vui lòng chọn ảnh thumbnail");
      return;
    }

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    if (!authorName.trim()) {
      toast.error("Vui lòng nhập tên tác giả");
      return;
    }

    const userId = getUserId();
    if (!userId && !isEditMode) {
      toast.error("Không tìm thấy thông tin tác giả");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("content", content);
      formData.append("status", status);
      formData.append("author", authorName.trim());

      if (category) {
        formData.append("category", category);
      }

      // If new file is selected, upload it
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      } else if (thumbnail.trim()) {
        // Keep existing thumbnail URL for edit mode
        formData.append("thumbnail", thumbnail.trim());
      }

      if (isEditMode) {
        await updateNews(news._id, formData);
        toast.success("Cập nhật tin tức thành công!");
      } else {
        formData.append("author", userId!);
        await createNews(formData);
        toast.success("Tạo tin tức thành công!");
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting news:", error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err.response?.data?.message ||
          `Không thể ${isEditMode ? "cập nhật" : "tạo"} tin tức`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Save className="h-5 w-5" />
                Chỉnh sửa tin tức
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Tạo tin tức mới
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Cập nhật thông tin tin tức"
              : "Tạo tin tức mới cho hệ thống"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-4 pr-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Nhập tiêu đề tin tức..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/200 ký tự
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả ngắn <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả ngắn..."
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

            {/* Author Name */}
            <div className="space-y-2">
              <Label htmlFor="author">
                Tên tác giả <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                placeholder="Nhập tên tác giả..."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-white"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {authorName.length}/100 ký tự
              </p>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label>
                Ảnh Thumbnail <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                {thumbnailPreview ? (
                  <div className="relative group">
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden">
                      <img
                        src={
                          thumbnailPreview.startsWith("blob:")
                            ? thumbnailPreview
                            : thumbnailPreview.startsWith("http")
                            ? thumbnailPreview
                            : `${
                                import.meta.env.VITE_URL_UPLOADS
                              }${thumbnailPreview}`
                        }
                        alt="Thumbnail preview"
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
                        setThumbnailFile(null);
                        setThumbnailPreview("");
                        setThumbnail("");
                        const input = document.getElementById(
                          "thumbnail"
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
                        document.getElementById("thumbnail")?.click();
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Thay đổi ảnh
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="thumbnail"
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

            {/* Content */}
            <div className="space-y-2">
              <Label>
                Nội dung <span className="text-red-500">*</span>
              </Label>
              <RichTextEditor
                initialValue={content}
                onChange={setContent}
                placeholder="Nhập nội dung bài viết..."
              />
              <p className="text-xs text-muted-foreground">
                Sử dụng toolbar để định dạng văn bản
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Danh mục</Label>
              <Select
                value={category || "none"}
                onValueChange={(value) =>
                  setCategory(value === "none" ? "" : value)
                }
                disabled={loadingCategories}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Chọn danh mục (không bắt buộc)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có danh mục</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingCategories && (
                <p className="text-xs text-muted-foreground">
                  Đang tải danh mục...
                </p>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>
                Trạng thái <span className="text-red-500">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as NewsStatus)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Bản nháp</SelectItem>
                  <SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

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
