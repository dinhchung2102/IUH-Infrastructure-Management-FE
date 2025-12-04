import { useState, useEffect } from "react";
import { NewsSidebar, NewsGrid } from "./components";
import { getPublicNews, getPublicNewsCategories } from "./api/news.api";
import type { PublicNews, PublicNewsCategory } from "./api/news.api";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function NewsPage() {
  const [news, setNews] = useState<PublicNews[]>([]);
  const [categories, setCategories] = useState<PublicNewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await getPublicNewsCategories();
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getPublicNews({
        page: currentPage,
        limit: 6,
        category: selectedCategory || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success && response.data) {
        setNews(response.data.news);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <section className="container py-16">
        {loading && categories.length === 0 ? (
          <div className="grid gap-8 lg:grid-cols-4">
            <Skeleton className="h-[400px]" />
            <div className="lg:col-span-3">
              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-[400px]" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-4">
            <NewsSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              latestNews={news.slice(0, 5)}
              featuredNews={news.filter(
                (item) =>
                  new Date(item.createdAt).getTime() >
                  Date.now() - 7 * 24 * 60 * 60 * 1000
              )}
            />
            <NewsGrid
              news={news}
              loading={loading}
              pagination={pagination}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}
