import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import nhaEBackground from "@/assets/background/nhaE.png";
import csvc002 from "@/assets/about/csvc002.jpg";
import csvc005 from "@/assets/about/csvc005.jpg";
import csvc007 from "@/assets/about/csvc007.jpg";

const images = [nhaEBackground, csvc002, csvc005, csvc007];

export function AboutHeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="relative overflow-hidden h-[400px] md:h-[500px] lg:h-[600px]">
      {/* Carousel Background Images */}
      <div className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12 backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:bg-white/20 rounded-full h-12 w-12 backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
