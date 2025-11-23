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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Newspaper, Calendar, Eye, User, FolderOpen } from "lucide-react";
import type { News } from "../types/news.type";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getNewsStatusBadge } from "@/config/badge.config";

interface NewsDetailDialogProps {
  news: News | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function NewsDetailDialog({
  news,
  open,
  onOpenChange,
}: NewsDetailDialogProps) {
  if (!news) return null;

  const renderContent = () => {
    if (typeof news.content === "string") {
      // If content is HTML string
      if (news.content.includes("<")) {
        // Convert className to class for proper HTML rendering
        const htmlContent = news.content.replace(/className=/g, "class=");
        return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
      }
      // If content is plain text
      return <p className="whitespace-pre-wrap">{news.content}</p>;
    }
    // If content is object (JSON)
    return (
      <pre className="bg-muted p-4 rounded overflow-x-auto text-xs">
        {JSON.stringify(news.content, null, 2)}
      </pre>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Newspaper className="h-5 w-5" />
            Chi tiết tin tức
          </DialogTitle>
          <DialogDescription>Thông tin chi tiết về bài viết</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-6 pr-4">
            {/* Header Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold">{news.title}</h3>
                  <p className="text-muted-foreground">{news.description}</p>
                </div>
                {getNewsStatusBadge(news.status)}
              </div>
            </div>

            <Separator />

            {/* Thumbnail */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Hình ảnh thumbnail</h4>
              <img
                src={
                  news.thumbnail.startsWith("http")
                    ? news.thumbnail
                    : `${import.meta.env.VITE_URL_UPLOADS}${news.thumbnail}`
                }
                alt={news.title}
                className="w-full h-64 object-cover rounded-lg border"
              />
            </div>

            <Separator />

            {/* Author and Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Author */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Tác giả</span>
                </div>
                {typeof news.author === "string" ? (
                  <p className="font-medium">{news.author}</p>
                ) : (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      {news.author.avatar && (
                        <AvatarImage
                          src={
                            news.author.avatar.startsWith("http")
                              ? news.author.avatar
                              : `${import.meta.env.VITE_URL_UPLOADS}${
                                  news.author.avatar
                                }`
                          }
                        />
                      )}
                      <AvatarFallback>
                        {getUserInitials(news.author.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{news.author.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {news.author.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Category */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Danh mục</span>
                </div>
                {news.category ? (
                  typeof news.category === "string" ? (
                    <p className="font-medium">{news.category}</p>
                  ) : (
                    <div className="space-y-2">
                      <Badge variant="outline" className="font-normal">
                        {news.category.name}
                      </Badge>
                      {news.category.description && (
                        <p className="text-xs text-muted-foreground">
                          {news.category.description}
                        </p>
                      )}
                    </div>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Chưa phân loại
                  </p>
                )}
              </div>

              {/* Views */}
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Lượt xem</span>
                </div>
                <p className="text-3xl font-bold text-primary">
                  {news.views || 0}
                </p>
              </div>
            </div>

            <Separator />

            {/* Content */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Nội dung</h4>
              <div className="bg-white border rounded-lg p-4 prose prose-sm max-w-none">
                {renderContent()}
              </div>
            </div>

            <Separator />

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
                  {format(new Date(news.createdAt), "dd/MM/yyyy HH:mm", {
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
                  {format(new Date(news.updatedAt), "dd/MM/yyyy HH:mm", {
                    locale: vi,
                  })}
                </p>
              </div>
            </div>

            {/* Slug */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Slug (URL)</p>
              <p className="font-mono text-sm">{news.slug}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
