"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  CalendarDays,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { MaintenanceCalendarDialog } from "../components/MaintenanceCalendarDialog";
import { MaintenanceAddDialog } from "../components/MaintenanceAddDialog";
import { useMaintenanceManagement } from "../hooks";
import {
  getMaintenanceStatusBadge,
  getPriorityBadge,
} from "@/config/badge.config";
import { deleteMaintenance } from "../api/maintenance.api";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import PaginationComponent from "@/components/PaginationComponent";
import { TableSkeleton } from "@/components/TableSkeleton";
import { Label } from "@/components/ui/label";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
import { getAssets } from "@/admin/asset-management/api/asset.api";
import { getStaff } from "@/admin/staff-management/api/staff.api";
import type { AssetResponse } from "@/admin/asset-management/api/asset.api";
import type { StaffResponse } from "@/admin/staff-management/types/staff.type";
import type { Maintenance } from "../types/maintenance.type";

export default function MaintenancePage() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  const {
    maintenances,
    loading,
    filters,
    pagination,
    paginationRequest,
    handleFiltersChange,
    handlePageChange,
    clearFilters,
    refetch,
  } = useMaintenanceManagement();

  // Sync searchInput với filters.search
  useEffect(() => {
    setSearchInput(filters.search || "");
  }, [filters.search]);

  // Fetch assets and staff for filters
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoadingAssets(true);
        const response = await getAssets({ limit: 1000 });
        if (response.success && response.data) {
          setAssets(response.data.assets || []);
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoadingAssets(false);
      }
    };

    const fetchStaff = async () => {
      try {
        setLoadingStaff(true);
        const response = await getStaff({ page: 1, limit: 1000 });
        if (response.success && response.data) {
          setStaffList(response.data.accounts || []);
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchAssets();
    fetchStaff();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lịch bảo trì này không?")) {
      return;
    }

    try {
      const response = await deleteMaintenance(id);
      if (response.success) {
        toast.success("Xóa lịch bảo trì thành công");
        refetch();
      } else {
        toast.error(response.message || "Không thể xóa lịch bảo trì");
      }
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      toast.error("Lỗi khi xóa lịch bảo trì");
    }
  };

  const handleEdit = (maintenance: Maintenance) => {
    // TODO: Implement edit dialog
    console.log("Edit maintenance:", maintenance);
    toast.info("Tính năng chỉnh sửa đang được phát triển");
  };

  const handleViewDetail = (maintenance: Maintenance) => {
    // TODO: Implement detail dialog
    console.log("View detail maintenance:", maintenance);
    toast.info("Tính năng xem chi tiết đang được phát triển");
  };

  // Transform maintenances to calendar events
  const calendarEvents = maintenances.map((m) => ({
    id: m._id,
    title: m.title,
    start: m.scheduledDate,
    status: m.status,
    priority: m.priority,
    asset: m.asset.name,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Lịch bảo trì thiết bị</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenCalendar(true)}>
            <CalendarDays className="w-4 h-4" /> Xem lịch bảo trì
          </Button>
          <Button onClick={() => setOpenAdd(true)}>
            <Plus className="w-4 h-4" /> Thêm lịch bảo trì
          </Button>
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Ô tìm kiếm */}
          <div className="flex-1 min-w-[250px] space-y-2">
            <Label>Tìm kiếm</Label>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleFiltersChange({ search: searchInput });
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Tìm kiếm theo tên, mô tả, thiết bị..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-white"
              />
              <Button
                type="submit"
                variant="default"
                className="cursor-pointer"
              >
                Tìm kiếm
              </Button>
            </form>
          </div>

          {/* Dropdown Trạng thái */}
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                handleFiltersChange({
                  status: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger className="w-[180px] bg-white cursor-pointer">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  Tất cả trạng thái
                </SelectItem>
                <SelectItem value="PENDING" className="cursor-pointer">
                  Chờ thực hiện
                </SelectItem>
                <SelectItem value="IN_PROGRESS" className="cursor-pointer">
                  Đang thực hiện
                </SelectItem>
                <SelectItem value="COMPLETED" className="cursor-pointer">
                  Hoàn thành
                </SelectItem>
                <SelectItem value="CANCELLED" className="cursor-pointer">
                  Đã hủy
                </SelectItem>
                <SelectItem value="OVERDUE" className="cursor-pointer">
                  Quá hạn
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Ưu tiên */}
          <div className="space-y-2">
            <Label>Độ ưu tiên</Label>
            <Select
              value={filters.priority || "all"}
              onValueChange={(value) =>
                handleFiltersChange({
                  priority: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger className="w-[180px] bg-white cursor-pointer">
                <SelectValue placeholder="Tất cả mức ưu tiên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  Tất cả ưu tiên
                </SelectItem>
                <SelectItem value="CRITICAL" className="cursor-pointer">
                  Khẩn cấp
                </SelectItem>
                <SelectItem value="HIGH" className="cursor-pointer">
                  Cao
                </SelectItem>
                <SelectItem value="MEDIUM" className="cursor-pointer">
                  Trung bình
                </SelectItem>
                <SelectItem value="LOW" className="cursor-pointer">
                  Thấp
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Thiết bị */}
          <div className="space-y-2 hidden">
            <Label>Thiết bị</Label>
            <Select
              value={filters.asset || "all"}
              onValueChange={(value) =>
                handleFiltersChange({
                  asset: value === "all" ? undefined : value,
                })
              }
              disabled={loadingAssets}
            >
              <SelectTrigger className="w-[180px] bg-white cursor-pointer">
                <SelectValue placeholder="Tất cả thiết bị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  Tất cả thiết bị
                </SelectItem>
                {assets.map((asset) => (
                  <SelectItem
                    key={asset._id}
                    value={asset._id}
                    className="cursor-pointer"
                  >
                    {asset.name} ({asset.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dropdown Nhân viên được gán */}
          <div className="space-y-2 hidden">
            <Label>Người được gán</Label>
            <Select
              value={filters.assignedTo || "all"}
              onValueChange={(value) =>
                handleFiltersChange({
                  assignedTo: value === "all" ? undefined : value,
                })
              }
              disabled={loadingStaff}
            >
              <SelectTrigger className="w-[180px] bg-white cursor-pointer">
                <SelectValue placeholder="Tất cả nhân viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  Tất cả nhân viên
                </SelectItem>
                {staffList.map((staff) => (
                  <SelectItem
                    key={staff._id}
                    value={staff._id}
                    className="cursor-pointer"
                  >
                    {staff.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Khoảng thời gian */}
          <div className="space-y-2">
            <Label>Khoảng thời gian</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={filters.startDate || ""}
                onChange={(e) =>
                  handleFiltersChange({
                    startDate: e.target.value || undefined,
                  })
                }
                className="w-[160px] bg-white"
                placeholder="Từ ngày"
              />
              <Input
                type="date"
                value={filters.endDate || ""}
                onChange={(e) =>
                  handleFiltersChange({ endDate: e.target.value || undefined })
                }
                className="w-[160px] bg-white"
                placeholder="Đến ngày"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="space-y-2">
            <Label className="opacity-0">Thao tác</Label>
            <ClearFiltersButton
              onClick={() => {
                setSearchInput("");
                clearFilters();
              }}
            />
          </div>
        </div>
      </div>

      {/* 📋 Bảng danh sách bảo trì */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">STT</TableHead>
              <TableHead>Tên công việc</TableHead>
              <TableHead>Thiết bị</TableHead>
              <TableHead>Ngày bảo trì</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ưu tiên</TableHead>
              <TableHead>Người phụ trách</TableHead>
              <TableHead className="text-center w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableSkeleton
                rows={paginationRequest.limit}
                columns={[
                  { type: "number", width: "w-12", align: "center" },
                  { type: "text", width: "w-[200px]" },
                  { type: "text", width: "w-[150px]" },
                  { type: "text", width: "w-[120px]" },
                  { type: "badge", width: "w-[100px]" },
                  { type: "badge", width: "w-[100px]" },
                  { type: "text", width: "w-[150px]" },
                  { type: "text", width: "w-[80px]", align: "center" },
                ]}
              />
            ) : maintenances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Không có lịch bảo trì nào phù hợp.
                </TableCell>
              </TableRow>
            ) : (
              maintenances.map((m, i) => (
                <TableRow key={m._id}>
                  <TableCell className="text-center">
                    {(paginationRequest.page - 1) * paginationRequest.limit +
                      i +
                      1}
                  </TableCell>
                  <TableCell className="font-medium">{m.title}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{m.asset.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.asset.code}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(m.scheduledDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </TableCell>
                  <TableCell>{getMaintenanceStatusBadge(m.status)}</TableCell>
                  <TableCell>{getPriorityBadge(m.priority)}</TableCell>
                  <TableCell>
                    {m.assignedTo.length > 0 ? (
                      <div className="flex flex-col gap-1">
                        {m.assignedTo.slice(0, 2).map((staff) => (
                          <span key={staff._id} className="text-sm">
                            {staff.fullName}
                          </span>
                        ))}
                        {m.assignedTo.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{m.assignedTo.length - 2} người khác
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Chưa gán</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleViewDetail(m)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEdit(m)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(m._id)}
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <PaginationComponent
          pagination={pagination}
          currentPage={paginationRequest.page}
          onPageChange={handlePageChange}
        />
      )}

      {/* Dialog thêm mới */}
      <MaintenanceAddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSuccess={refetch}
      />

      {/* Dialog lịch bảo trì */}
      <MaintenanceCalendarDialog
        open={openCalendar}
        onOpenChange={setOpenCalendar}
        events={calendarEvents}
      />
    </div>
  );
}
