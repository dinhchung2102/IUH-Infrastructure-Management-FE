import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Reveal, Parallax } from "@/components/motion";
import type { PublicNews } from "@/user/news/api/news.api";
import { getPublicNews } from "@/user/news/api/news.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Category mapping for display (match với news-category slugs)
const categoryConfig: Record<
  string,
  {
    color: "orange" | "green" | "blue" | "purple";
    label: string;
  }
> = {
  "bao-tri": {
    color: "orange",
    label: "Bảo trì",
  },
  "nang-cap": {
    color: "green",
    label: "Nâng cấp",
  },
  "sua-chua": {
    color: "purple",
    label: "Sửa chữa",
  },
  "thong-bao": {
    color: "blue",
    label: "Thông báo",
  },
};

const colorClasses = {
  orange: {
    gradient: "from-orange-600 to-red-600",
  },
  green: {
    gradient: "from-green-600 to-teal-600",
  },
  blue: {
    gradient: "from-blue-600 to-cyan-600",
  },
  purple: {
    gradient: "from-purple-600 to-pink-600",
  },
};

export function RecentNewsSection() {
  const [news, setNews] = useState<PublicNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getPublicNews({
          limit: 3,
          sortBy: "createdAt",
          sortOrder: "desc",
        });

        if (response.success && response.data) {
          setNews(response.data.news);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/20 via-background to-muted/20 py-8 md:py-12 lg:py-16 border-t">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-800/50" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      <div className="container relative">
        <Parallax from={-20} to={20}>
          <div className="mb-8 lg:mb-10 text-center">
            <h2
              className="text-2xl font-bold md:text-3xl lg:text-4xl uppercase"
              style={{ color: "#204195" }}
            >
              Tin tức - Thông báo
            </h2>
          </div>
        </Parallax>

        {/* News Grid - Show only 3 items */}
        <Parallax from={-15} to={15}>
          {loading ? (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {[1, 2, 3].map((index) => (
                <Card
                  key={index}
                  className="h-full flex flex-col border border-gray-200/50 dark:border-gray-700/50 shadow-lg rounded-2xl p-0"
                >
                  <div className="relative h-60 overflow-hidden rounded-t-2xl m-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <CardContent className="pt-0 pb-4 px-6 flex flex-col flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-6 animate-pulse" />
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-700/60 mt-auto">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {news.map((item, index) => {
              const categorySlug = (item.category as string) || "thong-bao";
              const config =
                categoryConfig[categorySlug] || categoryConfig["thong-bao"];
              const colors = colorClasses[config.color];

              return (
                <Reveal key={item._id} delay={index * 0.1}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl h-full flex flex-col dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl p-0">
                    <div className="relative h-60 overflow-hidden rounded-t-2xl m-0">
                      <img
                        src={
                          item.thumbnail.startsWith("http")
                            ? item.thumbnail
                            : `${import.meta.env.VITE_URL_UPLOADS || ""}${
                                item.thumbnail
                              }`
                        }
                        alt={item.title}
                        className="block w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary/20 text-white border-primary/30 backdrop-blur-sm px-3 py-1.5 text-xs font-medium shadow-lg">
                          {config.label}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="pt-0 pb-4 px-6 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="font-bold text-xl pb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight text-gray-800 dark:text-gray-100">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 text-justify dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-1">
                        {item.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 dark:border-gray-700/60 mt-auto">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(item.createdAt), "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 px-3 hover:bg-transparent hover:text-primary group/btn font-medium text-sm"
                        >
                          <Link to={`/news/${item.slug}`}>
                            <span className="text-sm">Xem thêm</span>
                          </Link>
                        </Button>
                      </div>
                    </CardContent>

                    {/* Gradient bar on hover */}
                    <div
                      className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${colors.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}
                    />
                  </Card>
                </Reveal>
              );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>Chưa có tin tức nào</p>
            </div>
          )}
        </Parallax>

        {/* View All Button */}

        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="group transition-all text-white hover:text-white bg-gradient-to-r from-blue-600 to-cyan-600 "
          >
            <Link to="/news" className="flex items-center gap-2">
              Xem tất cả
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
