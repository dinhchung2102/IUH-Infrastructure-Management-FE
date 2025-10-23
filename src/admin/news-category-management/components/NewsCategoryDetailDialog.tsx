import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FolderOpen, Calendar, CheckCircle2, XCircle } from "lucide-react";
import type { NewsCategory } from "../types/news-category.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface NewsCategoryDetailDialogProps {
  category: NewsCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsCategoryDetailDialog({
  category,
  open,
  onOpenChange,
}: NewsCategoryDetailDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Chi tiết danh mục
          </DialogTitle>
          <DialogDescription>
            Thông tin chi tiết về danh mục tin tức
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                  {category.description && (
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  )}
                </div>
                {category.isActive ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Hoạt động
                  </Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800 hover:bg-red-100 gap-1">
                    <XCircle className="h-3 w-3" />
                    Ngưng
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Image */}
            {category.image && (
              <>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Hình ảnh danh mục</h4>
                  <img
                    src={
                      category.image.startsWith("http")
                        ? category.image
                        : `${import.meta.env.VITE_URL_UPLOADS}${category.image}`
                    }
                    alt={category.name}
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
                <Separator />
              </>
            )}

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Ngày tạo
                  </span>
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(category.createdAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Cập nhật
                  </span>
                </div>
                <p className="font-medium text-sm">
                  {format(new Date(category.updatedAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
            </div>

            {/* Slug */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Slug (URL)</p>
              <p className="font-mono text-sm">{category.slug}</p>
            </div>

            {/* ID */}
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">ID</p>
              <p className="font-mono text-sm">{category._id}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
