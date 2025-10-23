import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PageTransition, Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<PublicNews | null>(null);
  const [relatedNews, setRelatedNews] = useState<PublicNews[]>([]);
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
        limit: 4,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      if (response.success && response.data) {
        // Filter out current news
        const filtered = response.data.news.filter(
          (item) => item._id !== excludeId
        );
        setRelatedNews(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error("Error fetching related news:", error);
    }
  };

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

        {/* Hero Section */}
        <Reveal>
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 py-12">
            <div className="container">
              <div className="mx-auto max-w-4xl">
                {/* Category Badge */}
                {news.category && typeof news.category !== "string" && (
                  <Badge className="mb-4" variant="secondary">
                    <Tag className="mr-1 h-3 w-3" />
                    {news.category}
                  </Badge>
                )}

                {/* Title */}
                <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
                  {news.title}
                </h1>

                {/* Description */}
                <p className="mb-6 text-xl text-gray-600">{news.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {typeof news.author === "string"
                        ? news.author
                        : news.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(news.createdAt), "dd MMMM yyyy", {
                        locale: vi,
                      })}
                    </span>
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
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Main Content */}
        <div className="container py-12">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Article Content */}
            <div className="lg:col-span-2">
              <Reveal>
                <Card className="overflow-hidden">
                  {/* Featured Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <img
                      src={
                        news.thumbnail.startsWith("http")
                          ? news.thumbnail
                          : `${import.meta.env.VITE_URL_UPLOADS}${
                              news.thumbnail
                            }`
                      }
                      alt={news.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-8 md:p-12">
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related News */}
              {relatedNews.length > 0 && (
                <Reveal delay={0.3}>
                  <Card className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Tin tức liên quan
                    </h3>
                    <Separator className="mb-4" />
                    <div className="space-y-4">
                      {relatedNews.map((item) => (
                        <Link
                          key={item._id}
                          to={`/news/${item.slug}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-muted">
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
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-primary">
                                {item.title}
                              </h4>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {format(
                                  new Date(item.createdAt),
                                  "dd/MM/yyyy",
                                  { locale: vi }
                                )}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <Link to="/news">
                      <Button variant="outline" className="w-full">
                        Xem tất cả tin tức
                      </Button>
                    </Link>
                  </Card>
                </Reveal>
              )}

              {/* Call to Action */}
              <Reveal delay={0.4}>
                <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 p-6">
                  <h3 className="mb-2 text-lg font-semibold">
                    Cần hỗ trợ thêm?
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Liên hệ với chúng tôi để được tư vấn và hỗ trợ
                  </p>
                  <Link to="/contact">
                    <Button className="w-full">Liên hệ ngay</Button>
                  </Link>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
