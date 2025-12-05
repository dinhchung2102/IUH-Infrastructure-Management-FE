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
    <div className="flex flex-wrap gap-4 items-end">
      {/* Search bar */}
      <div className="flex-1 min-w-[250px] space-y-2">
        <Label>Tìm kiếm</Label>
        <div className="relative w-full">
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
      </div>

      <div className="space-y-2">
        <Label>Trạng thái</Label>
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
                value === "all"
                  ? undefined
                  : value === "active"
                  ? true
                  : false,
            })
          }
        >
          <SelectTrigger className="w-[180px] bg-white cursor-pointer">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              Tất cả trạng thái
            </SelectItem>
            <SelectItem value="active" className="cursor-pointer">
              Đang hoạt động
            </SelectItem>
            <SelectItem value="inactive" className="cursor-pointer">
              Ngưng hoạt động
            </SelectItem>
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
          <SelectTrigger className="w-[180px] bg-white cursor-pointer">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt" className="cursor-pointer">
              Ngày tạo
            </SelectItem>
            <SelectItem value="updatedAt" className="cursor-pointer">
              Ngày cập nhật
            </SelectItem>
            <SelectItem value="name" className="cursor-pointer">
              Tên danh mục
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
          <SelectTrigger className="w-[140px] bg-white cursor-pointer">
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
