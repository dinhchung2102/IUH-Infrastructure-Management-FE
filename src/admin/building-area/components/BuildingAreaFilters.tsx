import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
import { Search } from "lucide-react";
import type { FilterType } from "../hooks/useBuildingAreaFilters";

interface BuildingAreaFiltersProps {
  search: string;
  filterType: FilterType;
  filterStatus: string;
  filterCampus: string;
  filterZoneType?: string;
  campuses: Array<{ _id: string; name: string }>;
  onSearchSubmit: (value: string) => void;
  onFilterTypeChange: (value: FilterType) => void;
  onFilterStatusChange: (value: string) => void;
  onFilterCampusChange: (value: string) => void;
  onFilterZoneTypeChange?: (value: string) => void;
  onClearFilters: () => void;
  hideTypeFilter?: boolean;
}

export function BuildingAreaFilters({
  search,
  filterType,
  filterStatus,
  filterCampus,
  filterZoneType = "",
  campuses,
  onSearchSubmit,
  onFilterTypeChange,
  onFilterStatusChange,
  onFilterCampusChange,
  onFilterZoneTypeChange,
  onClearFilters,
  hideTypeFilter = false,
}: BuildingAreaFiltersProps) {
  const [searchInput, setSearchInput] = useState(search);

  // Sync searchInput with search prop when it changes externally (e.g., clear filters)
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchInput);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px] space-y-2">
          <Label>Tìm kiếm</Label>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" className="cursor-pointer">
              <Search className="h-4 w-4" />
              Tìm kiếm
            </Button>
          </form>
        </div>

        {!hideTypeFilter && (
          <div className="space-y-2">
            <Label>Loại</Label>
            <Select value={filterType} onValueChange={onFilterTypeChange}>
              <SelectTrigger className="w-[160px] bg-white cursor-pointer">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUILDING" className="cursor-pointer">
                  Tòa nhà
                </SelectItem>
                <SelectItem value="AREA" className="cursor-pointer">
                  Khu vực ngoài trời
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {filterType === "AREA" && onFilterZoneTypeChange && (
          <div className="space-y-2">
            <Label>Chức năng</Label>
            <Select
              value={filterZoneType}
              onValueChange={onFilterZoneTypeChange}
            >
              <SelectTrigger className="w-[160px] bg-white cursor-pointer">
                <SelectValue placeholder="Chọn chức năng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FUNCTIONAL" className="cursor-pointer">
                  Chức năng
                </SelectItem>
                <SelectItem value="TECHNICAL" className="cursor-pointer">
                  Kỹ thuật
                </SelectItem>
                <SelectItem value="SERVICE" className="cursor-pointer">
                  Dịch vụ
                </SelectItem>
                <SelectItem value="PUBLIC" className="cursor-pointer">
                  Công cộng
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="w-[160px] bg-white cursor-pointer">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE" className="cursor-pointer">
                Đang hoạt động
              </SelectItem>
              <SelectItem value="UNDERMAINTENANCE" className="cursor-pointer">
                Bảo trì
              </SelectItem>
              <SelectItem value="INACTIVE" className="cursor-pointer">
                Ngừng hoạt động
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cơ sở</Label>
          <Select value={filterCampus} onValueChange={onFilterCampusChange}>
            <SelectTrigger className="w-[200px] bg-white cursor-pointer">
              <SelectValue placeholder="Chọn cơ sở" />
            </SelectTrigger>
            <SelectContent>
              {campuses.length > 0 ? (
                campuses.map((c) => (
                  <SelectItem
                    key={c._id}
                    value={c._id}
                    className="cursor-pointer"
                  >
                    {c.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-data" disabled className="cursor-pointer">
                  Không có dữ liệu
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="opacity-0">Thao tác</Label>
          <ClearFiltersButton onClick={onClearFilters} />
        </div>
      </div>
    </div>
  );
}
