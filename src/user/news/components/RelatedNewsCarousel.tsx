import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { PublicNews } from "../api/news.api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface RelatedNewsCarouselProps {
  news: PublicNews[];
}

export function RelatedNewsCarousel({ news }: RelatedNewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || news.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, news.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (news.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="mb-6">
        <h2
          className="text-2xl font-bold uppercase"
          style={{ color: "#204195" }}
        >
          Tin liên quan
        </h2>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {news.map((item) => (
            <div key={item._id} className="min-w-full flex-shrink-0">
              <Link to={`/news/${item.slug}`} className="block">
                <Card className="group flex gap-4 overflow-hidden transition-all duration-300 hover:shadow-lg">
                  {/* Image */}
                  <div className="relative w-80 h-48 flex-shrink-0 overflow-hidden bg-muted">
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
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      Tin tức
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(item.createdAt), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {news.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dot Indicators */}
        {news.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
