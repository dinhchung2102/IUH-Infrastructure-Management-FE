"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getCampus, deleteCampus, getCampusStats } from "../api/campus.api";
import { Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getActiveStatusBadge } from "@/config/badge.config";
import { TableSkeleton } from "@/components/TableSkeleton";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { CampusStatsCards } from "../components/CampusStatsCards";
import { CampusStatsDialog } from "../components/CampusStatsDialog";
import { CampusAddDialog } from "../components/CampusAddDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

function CampusPage() {
  const [campuses, setCampuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editCampus, setEditCampus] = useState<any>(null);
  // Bộ lọc
  const [statusFilter, setStatusFilter] = useState("all");
  const [managerFilter, setManagerFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  /** ============================
   *  Fetch API
   *  ============================ */
  const fetchCampus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCampus({});
      const list = res?.data?.campuses || [];
      setCampuses(list);
    } catch (err) {
      console.error("Lỗi khi tải cơ sở:", err);
      toast.error("Không thể tải danh sách cơ sở");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getCampusStats();
      setStats(res || null); // ✅ đúng
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    }
  }, []);

  useEffect(() => {
    fetchCampus();
    fetchStats();
  }, [fetchCampus, fetchStats]);

  /** ============================
   *  Handlers
   *  ============================ */
  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Không tìm thấy ID cơ sở.");
    const confirmDelete = confirm("Bạn có chắc muốn xóa cơ sở này?");

    if (!confirmDelete) return;

    try {
      await deleteCampus(id);
      toast.success("Đã xóa cơ sở thành công!");
      fetchCampus();
      fetchStats();
    } catch (err: any) {
      console.error("Lỗi khi xóa cơ sở:", err);
      if (err?.response?.status === 404) {
        toast.error("Cơ sở không tồn tại hoặc đã bị xóa trước đó.");
      } else if (err?.response?.status === 409) {
        toast.error("Không thể xóa cơ sở này (đang được sử dụng).");
      } else {
        toast.error("Có lỗi xảy ra khi xóa cơ sở.");
      }
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setManagerFilter("all");
    setRegionFilter("all");
  };

  /** ============================
   *  Filter logic
   *  ============================ */
  const filteredCampuses = campuses.filter((c) => {
    const matchSearch =
      c?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c?.email?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || c.status === statusFilter;

    const matchManager =
      managerFilter === "all"
        ? true
        : managerFilter === "has"
        ? !!c.manager
        : !c.manager;

    const matchRegion =
      regionFilter === "all" ||
      c.region?.toLowerCase() === regionFilter.toLowerCase();

    return matchSearch && matchStatus && matchManager && matchRegion;
  });

  /** ============================
   *  UI
   *  ============================ */
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/campus" },
            { label: "Quản lý cơ sở", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => setOpenStatsDialog(true)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="default"
            onClick={() => setOpenAddDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm cơ sở
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <CampusStatsCards stats={stats} loading={loading} />

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 min-w-[250px] flex gap-2"
        >
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit">Tìm kiếm</Button>
        </form>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>

        <Select value={managerFilter} onValueChange={setManagerFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Tất cả quản lý" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả quản lý</SelectItem>
            <SelectItem value="has">Có người quản lý</SelectItem>
            <SelectItem value="none">Chưa có người quản lý</SelectItem>
          </SelectContent>
        </Select>

        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Tất cả khu vực" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khu vực</SelectItem>
            <SelectItem value="bắc">Miền Bắc</SelectItem>
            <SelectItem value="trung">Miền Trung</SelectItem>
            <SelectItem value="nam">Miền Nam</SelectItem>
          </SelectContent>
        </Select>

        {(search ||
          statusFilter !== "all" ||
          managerFilter !== "all" ||
          regionFilter !== "all") && (
          <Button variant="outline" onClick={handleClearFilters}>
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">STT</TableHead>
              <TableHead>Tên cơ sở</TableHead>
              <TableHead>Địa chỉ</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Người quản lý</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center w-24">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableSkeleton
                rows={5}
                columns={[
                  { type: "number" },
                  { type: "text" },
                  { type: "text" },
                  { type: "text" },
                  { type: "text" },
                  { type: "badge" },
                  { type: "badge" },
                  { type: "text" },
                ]}
              />
            )}

            {!loading && filteredCampuses.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Không có cơ sở nào phù hợp.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              filteredCampuses.map((c, i) => (
                <TableRow key={c._id}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.address}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>
                    {c.manager ? (
                      <div>
                        <p className="font-medium text-sm">
                          {c.manager.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.manager.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Chưa có
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {getActiveStatusBadge(
                      c.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"
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
                          onClick={() => setEditCampus(c)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(c._id)}
                          className="text-red-600 focus:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog thống kê */}
      <CampusStatsDialog
        open={openStatsDialog}
        onOpenChange={setOpenStatsDialog}
      />

      {/* Dialog thêm cơ sở */}
      <CampusAddDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        mode="add"
        onSuccess={() => {
          fetchCampus();
          fetchStats();
        }}
      />

      {editCampus && (
        <CampusAddDialog
          open={!!editCampus}
          onOpenChange={(open) => !open && setEditCampus(null)}
          mode="edit"
          campus={editCampus}
          onSuccess={() => {
            setEditCampus(null);
            fetchCampus();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}

export default CampusPage;
