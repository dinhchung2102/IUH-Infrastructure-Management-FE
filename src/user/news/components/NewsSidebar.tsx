import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tag, Calendar, Building2, Star, ChevronRight } from "lucide-react";
import type { PublicNews, PublicNewsCategory } from "../api/news.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface NewsSidebarProps {
  categories: PublicNewsCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  latestNews: PublicNews[];
  featuredNews?: PublicNews[];
}

export function NewsSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  latestNews,
  featuredNews = [],
}: NewsSidebarProps) {
  return (
    <aside className="lg:col-span-1 space-y-6">
      {/* Danh mục */}
      <Card>
        <CardHeader>
          <CardTitle
            className="text-lg font-bold uppercase flex items-center gap-2"
            style={{ color: "#204195" }}
          >
            <Tag className="h-5 w-5" style={{ color: "#204195" }} />
            Danh mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === "" ? "default" : "ghost"}
              className={cn(
                "w-full justify-between",
                selectedCategory === ""
                  ? "bg-[#204195] text-white hover:bg-[#204195]/90 hover:text-white/95"
                  : ""
              )}
              onClick={() => onCategoryChange("")}
            >
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tất cả
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={
                  selectedCategory === category._id ? "default" : "ghost"
                }
                className={cn(
                  "w-full justify-between",
                  selectedCategory === category._id
                    ? "bg-[#204195] text-white hover:bg-[#204195]/90 hover:text-white/95"
                    : ""
                )}
                onClick={() => onCategoryChange(category._id)}
              >
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {category.name}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Video YouTube */}
      <Card>
        <CardHeader>
          <CardTitle
            className="text-lg font-bold uppercase flex items-center gap-2"
            style={{ color: "#204195" }}
          >
            <Building2 className="h-5 w-5" style={{ color: "#204195" }} />
            Video IUH
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/a7U93Lhfe2Q"
              title="IUH Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tin tức nổi bật */}
      <Card>
        <CardHeader>
          <CardTitle
            className="text-lg font-bold uppercase flex items-center gap-2"
            style={{ color: "#204195" }}
          >
            <Star className="h-5 w-5" style={{ color: "#204195" }} />
            Tin tức nổi bật
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {featuredNews.length === 0 && latestNews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có tin tức nào
            </p>
          ) : (
            (featuredNews.length > 0
              ? featuredNews
              : latestNews.slice(0, 5)
            ).map((item, index) => (
              <div key={item._id}>
                {index > 0 && <Separator className="mb-4" />}
                <Link to={`/news/${item.slug}`} className="block group">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-tight transition-colors group-hover:text-primary line-clamp-2">
                      {item.title}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(item.createdAt), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </p>
                  </div>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
