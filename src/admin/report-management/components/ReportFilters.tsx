import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ReportFiltersProps {
  filters: {
    search: string;
    status: string;
    priority: string;
    type: string;
    dateFrom: string;
    dateTo: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "REJECTED", label: "Đã từ chối" },
];

const priorityOptions = [
  { value: "all", label: "Tất cả mức độ" },
  { value: "LOW", label: "Thấp" },
  { value: "MEDIUM", label: "Trung bình" },
  { value: "HIGH", label: "Cao" },
  { value: "URGENT", label: "Khẩn cấp" },
];

const typeOptions = [
  { value: "all", label: "Tất cả loại" },
  { value: "DAMAGE", label: "Hư hỏng" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "CLEANING", label: "Vệ sinh" },
  { value: "OTHER", label: "Khác" },
];

export function ReportFilters({
  filters,
  onFilterChange,
  onReset,
}: ReportFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Sync searchInput với filters.search khi reset từ bên ngoài
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilterChange("search", searchInput);
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.type !== "all";

  return (
    <div className="flex flex-wrap gap-4">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex-1 min-w-[250px] flex gap-2">
        <Input
          placeholder="Tìm theo mã báo cáo, người báo cáo, thiết bị..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="bg-white"
        />
        <Button type="submit" variant="default" className="cursor-pointer">
          Tìm kiếm
        </Button>
      </form>

      {/* Status Filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select
        value={filters.priority}
        onValueChange={(value) => onFilterChange("priority", value)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Mức độ" />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select
        value={filters.type}
        onValueChange={(value) => onFilterChange("type", value)}
      >
        <SelectTrigger className="w-[180px] bg-white">
          <SelectValue placeholder="Loại báo cáo" />
        </SelectTrigger>
        <SelectContent>
          {typeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onReset}>
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
}
