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
import { Button } from "@/components/ui/button";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";

interface Campus {
  _id: string;
  name: string;
}

interface ZoneFiltersProps {
  search: string;
  statusFilter: string;
  campusFilter: string;
  zoneTypeFilter: string;
  campuses: Campus[];
  onSearchSubmit: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onCampusFilterChange: (value: string) => void;
  onZoneTypeFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export function ZoneFilters({
  search,
  statusFilter,
  campusFilter,
  zoneTypeFilter,
  campuses,
  onSearchSubmit,
  onStatusFilterChange,
  onCampusFilterChange,
  onZoneTypeFilterChange,
  onClearFilters,
}: ZoneFiltersProps) {
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
              placeholder="Tìm kiếm khu vực..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white"
            />
            <Button type="submit">Tìm kiếm</Button>
          </form>
        </div>

        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px] bg-white cursor-pointer">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Cơ sở</Label>
          <Select value={campusFilter} onValueChange={onCampusFilterChange}>
            <SelectTrigger className="w-[220px] bg-white cursor-pointer">
              <SelectValue placeholder="Tất cả cơ sở" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả cơ sở</SelectItem>
              {campuses.map((c) => (
                <SelectItem
                  key={c._id}
                  value={c._id}
                  className="cursor-pointer"
                >
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Loại khu vực</Label>
          <Select value={zoneTypeFilter} onValueChange={onZoneTypeFilterChange}>
            <SelectTrigger className="w-[200px] bg-white cursor-pointer">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
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

        <div className="space-y-2">
          <Label className="opacity-0">Thao tác</Label>
          <ClearFiltersButton onClick={onClearFilters} />
        </div>
      </div>
    </div>
  );
}

