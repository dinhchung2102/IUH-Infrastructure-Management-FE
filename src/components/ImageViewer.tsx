import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageViewer({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoom(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onOpenChange(false);
  };

  // Reset zoom khi đóng dialog
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setZoom(1);
      setCurrentIndex(initialIndex);
    }
    onOpenChange(open);
  };

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:max-w-7xl max-h-[95vh] p-0 bg-black/95 border-none"
        showCloseButton={false}
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-[95vh] flex items-center justify-center">
          {/* Close Button */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </DialogClose>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-50 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/60 rounded-full p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="text-white hover:bg-white/20 rounded-full h-9 w-9"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className="text-white text-sm font-medium min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="text-white hover:bg-white/20 rounded-full h-9 w-9"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Main Image */}
          <div className="flex items-center justify-center w-full h-full p-16 overflow-auto">
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className={cn(
                "max-w-full max-h-full object-contain transition-transform duration-200",
                zoom !== 1 && "cursor-move"
              )}
              style={{ transform: `scale(${zoom})` }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/60 rounded-lg p-2 max-w-[90vw] overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setZoom(1);
                  }}
                  className={cn(
                    "h-16 w-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all",
                    index === currentIndex
                      ? "border-white scale-110"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
