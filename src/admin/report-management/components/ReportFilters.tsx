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

interface ReportFiltersProps {
  filters: {
    search: string;
    status: string;
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
  { value: "APPROVED", label: "Đã duyệt" },
  { value: "REJECTED", label: "Đã từ chối" },
];

const typeOptions = [
  { value: "all", label: "Tất cả loại" },
  { value: "DAMAGED", label: "Hư hỏng" },
  { value: "MAINTENANCE", label: "Bảo trì" },
  { value: "LOST", label: "Mất thiết bị" },
  { value: "BUY_NEW", label: "Mua mới" },
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
      <ClearFiltersButton onClick={onReset} />
    </div>
  );
}
