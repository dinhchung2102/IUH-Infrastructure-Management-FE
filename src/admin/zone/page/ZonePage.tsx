"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getZones, deleteZone, getZoneStats } from "../api/zone.api";
import { getBuildings } from "../../building-area/api/building.api";
import {
  MapPin,
  Plus,
  BarChart3,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Wrench,
  Cog,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/TableSkeleton";
import { ZoneStatsCards } from "../components/ZoneStatsCard";
import { ZoneStatsDialog } from "../components/ZoneStatsDialog";
import { ZoneAddDialog } from "../components/ZoneAddDialog";
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

/* =========================================
   Icon & màu cho loại zone
========================================= */
const zoneTypeDisplay = {
  SERVICE: {
    label: "Dịch vụ",
    icon: Wrench,
    color: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  FUNCTIONAL: {
    label: "Chức năng",
    icon: Cog,
    color: "bg-purple-100 text-purple-700 border border-purple-300",
  },
};

function ZonePage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editZone, setEditZone] = useState<any>(null);

  // Bộ lọc
  const [statusFilter, setStatusFilter] = useState("all");
  const [campusFilter, setCampusFilter] = useState("all");
  const [campuses, setCampuses] = useState<any[]>([]);

  /* ============================
   *  Fetch API
   ============================ */
  const fetchZone = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getZones({});
      setZones(res?.data?.zones || []);
    } catch (err) {
      console.error("Lỗi khi tải khu vực:", err);
      toast.error("Không thể tải danh sách khu vực");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getZoneStats();
      setStats(res?.data || null);
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
    }
  }, []);

  const fetchCampuses = useCallback(async () => {
    try {
      const res = await getBuildings({});
      const unique = new Map();
      (res?.data?.buildings || []).forEach((b: any) => {
        if (b?.campus?._id) unique.set(b.campus._id, b.campus);
      });
      setCampuses(Array.from(unique.values()));
    } catch (err) {
      console.error("Lỗi khi tải cơ sở:", err);
    }
  }, []);

  useEffect(() => {
    fetchZone();
    fetchStats();
    fetchCampuses();
  }, [fetchZone, fetchStats, fetchCampuses]);

  /* ============================
   *  Handlers
   ============================ */
  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Không tìm thấy ID khu vực.");
    if (!confirm("Bạn có chắc muốn xóa khu vực này?")) return;

    try {
      await deleteZone(id);
      toast.success("Đã xóa khu vực thành công!");
      fetchZone();
      fetchStats();
    } catch (err: any) {
      console.error("Lỗi khi xóa khu vực:", err);
      if (err?.response?.status === 404)
        toast.error("Khu vực không tồn tại hoặc đã bị xóa trước đó.");
      else if (err?.response?.status === 409)
        toast.error("Không thể xóa khu vực này (đang được sử dụng).");
      else toast.error("Có lỗi xảy ra khi xóa khu vực.");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCampusFilter("all");
  };

  /* ============================
   *  Filter logic
   ============================ */
  const filteredZones = zones.filter((z) => {
    const matchSearch = z?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || z.status === statusFilter;
    const matchCampus =
      campusFilter === "all" ||
      z.building?.campus?._id === campusFilter;

    return matchSearch && matchStatus && matchCampus;
  });

  /* ============================
   *  UI
   ============================ */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Quản lý khu vực (Zone)</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setOpenStatsDialog(true)}>
            <BarChart3 className="mr-2 h-4 w-4" /> Xem thống kê
          </Button>
          <Button variant="default" onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Thêm khu vực
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <ZoneStatsCards stats={stats} onRefresh={fetchStats} loading={loading} />

      {/* Bộ lọc */}
      <div className="p-4 border bg-white rounded-lg space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="text-muted-foreground w-4 h-4" />

          {/* Ô tìm kiếm */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 flex-1 min-w-[260px]"
          >
            <Input
              placeholder="Tìm kiếm khu vực..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Tìm kiếm</Button>
          </form>

          {/* Dropdown Trạng thái */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="INACTIVE">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>

          {/* Dropdown Cơ sở */}
          <Select value={campusFilter} onValueChange={setCampusFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Tất cả cơ sở" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả cơ sở</SelectItem>
              {campuses.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || statusFilter !== "all" || campusFilter !== "all") && (
            <Button variant="outline" onClick={handleClearFilters}>
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">#</TableHead>
              <TableHead>Tên khu vực</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Tòa nhà</TableHead>
              <TableHead>Cơ sở</TableHead>
              <TableHead>Tầng</TableHead>
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
                  { type: "badge" },
                  { type: "text" },
                  { type: "text" },
                  { type: "text" },
                  { type: "badge" },
                  { type: "text" },
                ]}
              />
            )}

            {!loading && filteredZones.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Không có khu vực nào phù hợp.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              filteredZones.map((z, i) => {
                const zt = zoneTypeDisplay[z.zoneType as keyof typeof zoneTypeDisplay];
                const Icon = zt?.icon;
                return (
                  <TableRow key={z._id}>
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell className="font-medium">{z.name}</TableCell>
                    <TableCell>
                      {zt ? (
                        <Badge className={`flex items-center gap-1 ${zt.color}`}>
                          <Icon className="w-4 h-4" />
                          {zt.label}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{z.building?.name || "—"}</TableCell>
                    <TableCell>{z.building?.campus?.name || "—"}</TableCell>
                    <TableCell>{z.floorLocation ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          z.status === "ACTIVE" ? "success" : "destructive"
                        }
                      >
                        {z.status === "ACTIVE"
                          ? "Hoạt động"
                          : "Ngừng hoạt động"}
                      </Badge>
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
                            onClick={() => setEditZone(z)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(z._id)}
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {/* Dialog thống kê */}
      <ZoneStatsDialog
        open={openStatsDialog}
        onOpenChange={setOpenStatsDialog}
      />

      {/* Dialog thêm/sửa khu vực */}
      <ZoneAddDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        mode="add"
        onSuccess={() => {
          fetchZone();
          fetchStats();
        }}
      />

      {editZone && (
        <ZoneAddDialog
          open={!!editZone}
          onOpenChange={(open) => !open && setEditZone(null)}
          mode="edit"
          zone={editZone}
          onSuccess={() => {
            setEditZone(null);
            fetchZone();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}

export default ZonePage;
