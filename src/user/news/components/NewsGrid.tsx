import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Reveal } from "@/components/motion";
import { Calendar, FolderOpen } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
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
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FolderOpen className="h-5 w-5" />
          <h2
            className="text-2xl font-bold uppercase"
            style={{ color: "#204195" }}
          >
            Tin tức
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin mới nhất từ IUH
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
          <div className="space-y-4">
            {news.map((item, index) => {
              const isNew =
                new Date(item.createdAt).getTime() >
                Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days
              return (
                <Reveal key={item._id} delay={index * 0.1}>
                  <Link to={`/news/${item.slug}`} className="block">
                    <Card className="group flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:shadow-lg">
                      {/* Image - Left side */}
                      <div className="relative w-full md:w-80 h-48 md:h-48 flex-shrink-0 overflow-hidden bg-muted">
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
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        {/* News label overlay */}
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Tin tức
                        </div>
                      </div>

                      {/* Content - Right side */}
                      <div className="flex flex-1 flex-col p-4">
                        {/* Date and New tag */}
                        <div className="mb-2 flex items-center gap-3">
                          <span className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(item.createdAt), "dd/MM/yyyy", {
                              locale: vi,
                            })}
                          </span>
                          {isNew && (
                            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                              New
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          handlePageChange(currentPage - 1);
                        }
                      }}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination.totalPages }).map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      page === 1 ||
                      page === pagination.totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page);
                            }}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < pagination.totalPages) {
                          handlePageChange(currentPage + 1);
                        }
                      }}
                      className={
                        currentPage === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
