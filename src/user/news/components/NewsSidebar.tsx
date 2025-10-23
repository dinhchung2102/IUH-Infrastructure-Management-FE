import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tag, Calendar, Clock } from "lucide-react";
import type { PublicNews, PublicNewsCategory } from "../api/news.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface NewsSidebarProps {
  categories: PublicNewsCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  latestNews: PublicNews[];
}

export function NewsSidebar({
  categories,
  selectedCategory,
  onCategoryChange,
  latestNews,
}: NewsSidebarProps) {
  return (
    <aside className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh mục</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === "" ? "default" : "ghost"}
              className="w-full justify-between"
              onClick={() => onCategoryChange("")}
            >
              <span className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tất cả
              </span>
            </Button>
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={
                  selectedCategory === category._id ? "default" : "ghost"
                }
                className="w-full justify-between"
                onClick={() => onCategoryChange(category._id)}
              >
                <span className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  {category.name}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tin mới nhất
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestNews.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có tin tức nào
            </p>
          ) : (
            latestNews.map((item, index) => (
              <div key={item._id}>
                {index > 0 && <Separator className="mb-4" />}
                <Link to={`/news/${item.slug}`} className="block">
                  <div className="space-y-1 group">
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
