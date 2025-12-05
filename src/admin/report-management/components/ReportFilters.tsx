import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <div className="flex flex-wrap gap-4 items-end">
      {/* Search Form */}
      <div className="flex-1 min-w-[250px] space-y-2">
        <Label>Tìm kiếm</Label>
        <form onSubmit={handleSearch} className="flex gap-2">
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
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label>Trạng thái</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => onFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px] bg-white cursor-pointer">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <Label>Loại báo cáo</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => onFilterChange("type", value)}
        >
          <SelectTrigger className="w-[180px] bg-white cursor-pointer">
            <SelectValue placeholder="Loại báo cáo" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <ClearFiltersButton onClick={onReset} />
    </div>
  );
}
