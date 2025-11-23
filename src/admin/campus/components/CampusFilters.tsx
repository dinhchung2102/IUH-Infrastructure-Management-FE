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
import { Search } from "lucide-react";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";

interface CampusFiltersProps {
  search: string;
  statusFilter: string;
  managerFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onManagerFilterChange: (value: string) => void;
  onClearFilters: () => void;
}

export function CampusFilters({
  search,
  statusFilter,
  managerFilter,
  onSearchChange,
  onStatusFilterChange,
  onManagerFilterChange,
  onClearFilters,
}: CampusFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px] space-y-2">
          <Label>Tìm kiếm</Label>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
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
          <Label>Trạng thái</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px] bg-white cursor-pointer">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem value="ACTIVE" className="cursor-pointer">
                Hoạt động
              </SelectItem>
              <SelectItem value="INACTIVE" className="cursor-pointer">
                Ngừng hoạt động
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Người quản lý</Label>
          <Select value={managerFilter} onValueChange={onManagerFilterChange}>
            <SelectTrigger className="w-[180px] bg-white cursor-pointer">
              <SelectValue placeholder="Tất cả quản lý" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Tất cả quản lý
              </SelectItem>
              <SelectItem value="has" className="cursor-pointer">
                Có người quản lý
              </SelectItem>
              <SelectItem value="none" className="cursor-pointer">
                Chưa có người quản lý
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
