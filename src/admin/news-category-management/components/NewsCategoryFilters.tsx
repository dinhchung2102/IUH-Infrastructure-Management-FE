import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { NewsCategoryFilters as NewsCategoryFiltersType } from "../types/news-category.type";

interface NewsCategoryFiltersProps {
  filters: NewsCategoryFiltersType;
  onFilterChange: (filters: NewsCategoryFiltersType) => void;
}

export function NewsCategoryFilters({
  filters,
  onFilterChange,
}: NewsCategoryFiltersProps) {
  const handleReset = () => {
    onFilterChange({
      search: "",
      isActive: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mô tả..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="pl-8 bg-white"
          />
        </div>

        <Select
          value={
            filters.isActive === undefined
              ? "all"
              : filters.isActive
              ? "active"
              : "inactive"
          }
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              isActive:
                value === "all" ? undefined : value === "active" ? true : false,
            })
          }
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy || "createdAt"}
          onValueChange={(value) =>
            onFilterChange({ ...filters, sortBy: value })
          }
        >
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Ngày tạo</SelectItem>
            <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
            <SelectItem value="name">Tên danh mục</SelectItem>
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
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Mới nhất</SelectItem>
            <SelectItem value="asc">Cũ nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleReset} className="gap-2">
        <X className="h-4 w-4" />
        Xóa bộ lọc
      </Button>
    </div>
  );
}
