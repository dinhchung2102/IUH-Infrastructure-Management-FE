import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
import { useState, useEffect } from "react";

interface AuditFiltersProps {
  filters: {
    search: string;
    status: string;
    campus: string;
    zone: string;
    startDate: string;
    endDate: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export function AuditFilters({
  filters,
  onFilterChange,
  onReset,
}: AuditFiltersProps) {
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
    filters.campus !== "all" ||
    filters.zone !== "all" ||
    filters.startDate ||
    filters.endDate;

  return (
    <div className="flex flex-wrap gap-4">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex-1 min-w-[250px] flex gap-2">
        <Input
          placeholder="Tìm theo tiêu đề, mô tả, tên thiết bị..."
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

      {/* Date Range */}
      <div className="flex gap-2">
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => onFilterChange("startDate", e.target.value)}
          className="w-[160px] bg-white"
          placeholder="Từ ngày"
        />
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => onFilterChange("endDate", e.target.value)}
          className="w-[160px] bg-white"
          placeholder="Đến ngày"
        />
      </div>

      {/* Reset Button */}
      <ClearFiltersButton onClick={onReset} />
    </div>
  );
}
