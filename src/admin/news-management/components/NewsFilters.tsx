import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
import {
  NewsStatus,
  type NewsFilters as NewsFiltersType,
} from "../types/news.type";
import { getNewsCategories } from "@/admin/news-category-management/api/news-category.api";
import type { NewsCategory } from "@/admin/news-category-management/types/news-category.type";

interface NewsFiltersProps {
  filters: NewsFiltersType;
  onFilterChange: (filters: NewsFiltersType) => void;
}

export function NewsFilters({ filters, onFilterChange }: NewsFiltersProps) {
  const [categories, setCategories] = useState<NewsCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getNewsCategories({
          isActive: true,
          limit: 100,
        });
        setCategories(response.data?.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleReset = () => {
    onFilterChange({
      search: "",
      status: undefined,
      category: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search bar - full width on mobile */}
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tiêu đề, mô tả..."
          value={filters.search || ""}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="pl-8 bg-white"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              status: value === "all" ? undefined : (value as NewsStatus),
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value={NewsStatus.PUBLISHED}>Đã xuất bản</SelectItem>
            <SelectItem value={NewsStatus.DRAFT}>Bản nháp</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              category: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy || "createdAt"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger className="w-full sm:w-[160px] bg-white">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Ngày tạo</SelectItem>
            <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
            <SelectItem value="title">Tiêu đề</SelectItem>
            <SelectItem value="views">Lượt xem</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortOrder || "desc"}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              sortOrder: value as "asc" | "desc",
            })
          }
        >
          <SelectTrigger className="w-full sm:w-[130px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Mới nhất</SelectItem>
            <SelectItem value="asc">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>

        <ClearFiltersButton
          onClick={handleReset}
          className="w-full sm:w-auto sm:ml-auto"
        />
      </div>
    </div>
  );
}
