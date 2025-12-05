import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="flex flex-wrap gap-4 items-end">
      {/* Search bar */}
      <div className="flex-1 min-w-[250px] space-y-2">
        <Label>Tìm kiếm</Label>
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
      </div>

      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              status: value === "all" ? undefined : (value as NewsStatus),
            })
          }
        >
          <SelectTrigger className="w-[160px] bg-white cursor-pointer">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Tất cả trạng thái
            </SelectItem>
            <SelectItem value={NewsStatus.PUBLISHED} className="cursor-pointer">
              Đã xuất bản
            </SelectItem>
            <SelectItem value={NewsStatus.DRAFT} className="cursor-pointer">
              Bản nháp
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Danh mục</Label>
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              category: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger className="w-[160px] bg-white cursor-pointer">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Tất cả danh mục
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category._id}
                value={category._id}
                className="cursor-pointer"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Sắp xếp theo</Label>
        <Select
          value={filters.sortBy || "createdAt"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger className="w-[160px] bg-white cursor-pointer">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt" className="cursor-pointer">
              Ngày tạo
            </SelectItem>
            <SelectItem value="updatedAt" className="cursor-pointer">
              Ngày cập nhật
            </SelectItem>
            <SelectItem value="title" className="cursor-pointer">
              Tiêu đề
            </SelectItem>
            <SelectItem value="views" className="cursor-pointer">
              Lượt xem
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Thứ tự</Label>
        <Select
          value={filters.sortOrder || "desc"}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              sortOrder: value as "asc" | "desc",
            })
          }
        >
          <SelectTrigger className="w-[130px] bg-white cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc" className="cursor-pointer">
              Mới nhất
            </SelectItem>
            <SelectItem value="asc" className="cursor-pointer">
              Cũ nhất
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ClearFiltersButton onClick={handleReset} />
    </div>
  );
}
