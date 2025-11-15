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

interface BuildingAreaFiltersProps {
  search: string;
  filterType: string;
  filterStatus: string;
  filterCampus: string;
  campuses: Array<{ _id: string; name: string }>;
  onSearchChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onFilterCampusChange: (value: string) => void;
  onClearFilters: () => void;
}

export function BuildingAreaFilters({
  search,
  filterType,
  filterStatus,
  filterCampus,
  campuses,
  onSearchChange,
  onFilterTypeChange,
  onFilterStatusChange,
  onFilterCampusChange,
  onClearFilters,
}: BuildingAreaFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px] space-y-2">
          <Label>Tìm kiếm</Label>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" className="cursor-pointer">
              <Search className="h-4 w-4" />
              Tìm kiếm
            </Button>
          </form>
        </div>

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
