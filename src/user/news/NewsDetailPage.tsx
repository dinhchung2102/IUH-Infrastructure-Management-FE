import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageTransition, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Eye,
  Share2,
  Clock,
  Tag,
} from "lucide-react";
import { getPublicNewsBySlug, getPublicNews } from "./api/news.api";
import type { PublicNews } from "./api/news.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";
import { NewsSidebar, RelatedNewsCarousel } from "./components";
import { getPublicNewsCategories } from "./api/news.api";
import type { PublicNewsCategory } from "./api/news.api";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<PublicNews | null>(null);
  const [relatedNews, setRelatedNews] = useState<PublicNews[]>([]);
  const [categories, setCategories] = useState<PublicNewsCategory[]>([]);
  const [latestNews, setLatestNews] = useState<PublicNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchNewsDetail();
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchNewsDetail = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const response = await getPublicNewsBySlug(slug);

      if (response.success && response.data) {
        setNews(response.data.data);

        // Fetch related news from the same category
        if (response.data.data.category) {
          fetchRelatedNews(response.data.data.category, response.data.data._id);
        } else {
          fetchRelatedNews(undefined, response.data.data._id);
        }
      }
    } catch (error) {
      console.error("Error fetching news detail:", error);
      toast.error("Không thể tải chi tiết tin tức");
      navigate("/news");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedNews = async (categoryId?: string, excludeId?: string) => {
    try {
      const response = await getPublicNews({
        category: categoryId,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success && response.data) {
        // Filter out current news
        const filtered = response.data.news.filter(
          (item) => item._id !== excludeId
        );
        setRelatedNews(filtered.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching related news:", error);
    }
  };

  const fetchCategoriesAndLatestNews = async () => {
    try {
      const [categoriesResponse, newsResponse] = await Promise.all([
        getPublicNewsCategories(),
        getPublicNews({ limit: 5, sortBy: "createdAt", sortOrder: "desc" }),
      ]);

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data.categories);
      }

      if (newsResponse.success && newsResponse.data) {
        setLatestNews(newsResponse.data.news);
      }
    } catch (error) {
      console.error("Error fetching categories and latest news:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndLatestNews();
  }, []);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Đã sao chép liên kết!");
  };

  const renderContent = (content: string | Record<string, unknown>) => {
    if (typeof content === "string") {
      // If content is HTML string
      if (content.includes("<")) {
        // Convert className to class for proper HTML rendering
        const htmlContent = content.replace(/className=/g, "class=");

        return (
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );
      }
      // If content is plain text
      return <p className="whitespace-pre-wrap text-gray-700">{content}</p>;
    }
    // If content is object (JSON) - shouldn't happen in public view
    return (
      <pre className="overflow-x-auto rounded bg-muted p-4 text-xs">
        {JSON.stringify(content, null, 2)}
      </pre>
    );
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          {/* Hero Skeleton */}
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-12">
            <div className="container">
              <Skeleton className="mb-4 h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="container py-12">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-60 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!news) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center">
          <Card className="p-12">
            <p className="text-muted-foreground">Không tìm thấy tin tức</p>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb & Back Button */}
        <div className="border-b bg-white">
          <div className="container py-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/news")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách tin tức
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Sidebar - Left */}
            <div className="lg:col-span-1">
              <NewsSidebar
                categories={categories}
                selectedCategory={
                  typeof news.category === "string"
                    ? news.category
                    : typeof news.category === "object" && news.category
                    ? (news.category as { _id: string })._id
                    : ""
                }
                onCategoryChange={() => {}}
                latestNews={latestNews}
                featuredNews={latestNews.filter(
                  (item) =>
                    new Date(item.createdAt).getTime() >
                    Date.now() - 7 * 24 * 60 * 60 * 1000
                )}
              />
            </div>

            {/* Article Content */}
            <div className="lg:col-span-3">
              {/* Hero Banner with Image */}
              <Reveal>
                <div className="relative mb-8 h-[400px] md:h-[500px] overflow-hidden rounded-lg">
                  <img
                    src={
                      news.thumbnail.startsWith("http")
                        ? news.thumbnail
                        : `${import.meta.env.VITE_URL_UPLOADS}${news.thumbnail}`
                    }
                    alt={news.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-full pb-8 md:pb-12 px-4 md:px-8">
                      <div className="text-white">
                        {/* Date */}
                        <div className="mb-4 flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(news.createdAt), "dd/MM/yyyy", {
                              locale: vi,
                            })}
                          </span>
                        </div>
                        {/* Title */}
                        <h1 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                          {news.title}
                        </h1>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <Card className="overflow-hidden">
                  {/* Meta Info */}
                  <div className="border-b p-6">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Phòng quản trị</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>5 phút đọc</span>
                      </div>
                      {news.views !== undefined && (
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span>{news.views} lượt xem</span>
                        </div>
                      )}
                      {news.category && typeof news.category !== "string" && (
                        <Badge variant="secondary">
                          <Tag className="mr-1 h-3 w-3" />
                          {typeof news.category === "object" && news.category
                            ? (news.category as { name: string }).name
                            : news.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="border-b p-6">
                    <p className="text-lg text-muted-foreground">
                      {news.description}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    {renderContent(news.content)}
                  </div>
                </Card>
              </Reveal>

              {/* Share Section */}
              <Reveal delay={0.2}>
                <div className="mt-8 flex items-center justify-between rounded-lg border bg-white p-6">
                  <div>
                    <h3 className="font-semibold">Chia sẻ bài viết</h3>
                    <p className="text-sm text-muted-foreground">
                      Chia sẻ bài viết này với bạn bè
                    </p>
                  </div>
                  <Button onClick={handleShare} className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Chia sẻ
                  </Button>
                </div>
              </Reveal>

              {/* Related News Carousel */}
              {relatedNews.length > 0 && (
                <Reveal delay={0.3}>
                  <div className="mt-12">
                    <RelatedNewsCarousel news={relatedNews} />
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
