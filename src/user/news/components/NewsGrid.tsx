import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion";
import { Calendar, ArrowRight } from "lucide-react";
import type { PublicNews } from "../api/news.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface NewsGridProps {
  news: PublicNews[];
  loading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function NewsGrid({
  news,
  loading,
  pagination,
  currentPage,
  onPageChange,
}: NewsGridProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="lg:col-span-3">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-3">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {news.length} / {pagination.totalItems} bài viết
        </p>
      </div>

      {news.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Không tìm thấy tin tức nào
            </p>
            <p className="text-sm text-muted-foreground">
              Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {news.map((item, index) => (
              <Reveal key={item._id} delay={index * 0.1}>
                <Link to={`/news/${item.slug}`} className="block h-full">
                  <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
                    {/* Image - Full width, no padding */}
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={
                          item.thumbnail.startsWith("http")
                            ? item.thumbnail
                            : `${import.meta.env.VITE_URL_UPLOADS}${
                                item.thumbnail
                              }`
                        }
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.onerror = null; // Prevent infinite loop
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                        }}
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Meta info */}
                      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">
                          {typeof item.author === "string"
                            ? item.author
                            : item.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.createdAt), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-2 line-clamp-2 text-xl font-semibold leading-tight transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-4 line-clamp-3 flex-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>

                      {/* Read more button */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                          variant="link"
                          className="group/btn h-auto p-0 text-primary hover:no-underline"
                          asChild
                        >
                          <span>
                            <span className="mr-2 font-semibold">Đọc thêm</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trang trước
                </Button>

                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const page = i + 1;
                  // Show first, last, current, and adjacent pages
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span
                        key={page}
                        className="flex items-center px-2 text-muted-foreground"
                      >
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
