import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Newspaper, Search } from "lucide-react";

interface NewsHeroSectionProps {
  onSearch: (query: string) => void;
}

export function NewsHeroSection({ onSearch }: NewsHeroSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    // Clear previous timeout
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timeout
    debounceTimer.current = setTimeout(() => {
      onSearch(value);
    }, 500);
  };

  return (
    <section className="bg-gradient-to-b from-background to-muted/50 py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Newspaper className="mr-1 h-3 w-3" />
            Tin tức & Thông báo
          </Badge>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            Cập nhật mới nhất về{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cơ sở vật chất
            </span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Theo dõi các hoạt động bảo trì, nâng cấp và thông báo quan trọng về
            cơ sở vật chất của trường
          </p>
          {/* Search Bar */}
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm tin tức..."
              className="pl-10"
              value={searchValue}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
