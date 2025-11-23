"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getZones, deleteZone, getZoneStats } from "../api/zone.api";
import { getBuildings } from "../../building-area/api/building.api";
import { Plus, BarChart3, Pencil, Trash2 } from "lucide-react";
import { TableActionMenu } from "@/components/TableActionMenu";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getActiveStatusBadge } from "@/config/badge.config";
import { TableSkeleton } from "@/components/TableSkeleton";
import { ZoneStatsCards } from "../components/ZoneStatsCard";
import type { ZoneStats } from "../components/ZoneStatsCard";
import { ZoneStatsDialog } from "../components/ZoneStatsDialog";
import { ZoneAddDialog } from "../components/ZoneAddDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

/* =========================================
   Icon & màu cho loại zone
========================================= */
const zoneTypeDisplay = {
  FUNCTIONAL: {
    label: "Chức năng",
    color: "bg-purple-100 text-purple-700 border border-purple-300",
  },
  TECHNICAL: {
    label: "Kỹ thuật",
    color: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  SERVICE: {
    label: "Dịch vụ",
    color: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  PUBLIC: {
    label: "Công cộng",
    color: "bg-green-100 text-green-700 border border-green-300",
  },
};

function ZonePage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ZoneStats | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editZone, setEditZone] = useState<any>(null);

  // Bộ lọc
  const [statusFilter, setStatusFilter] = useState("all");
  const [campusFilter, setCampusFilter] = useState("all");
  const [zoneTypeFilter, setZoneTypeFilter] = useState("all");
  const [campuses, setCampuses] = useState<any[]>([]);

  /* ============================
   *  Fetch API
   ============================ */
  const fetchZone = useCallback(async () => {
    try {
      setLoading(true);
      const query: any = {};

      if (search) {
        query.search = search;
      }

      if (statusFilter !== "all") {
        query.status = statusFilter;
      }

      if (campusFilter !== "all") {
        query.campus = campusFilter;
      }

      if (zoneTypeFilter !== "all") {
        query.zoneType = zoneTypeFilter;
      }

      const res = await getZones(query);
      setZones(res?.data?.zones || []);
    } catch (err) {
      console.error("Lỗi khi tải khu vực:", err);
      toast.error("Không thể tải danh sách khu vực");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, campusFilter, zoneTypeFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getZoneStats();
      // Transform API response to component format
      if (res?.stats) {
        setStats({
          totalZones: res.stats.total || 0,
          activeZones: res.stats.active || 0,
          inactiveZones: res.stats.inactive || 0,
          newZonesThisMonth: res.stats.newThisMonth || 0,
        });
      } else {
        setStats(undefined);
      }
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
      setStats(undefined);
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
    setZoneTypeFilter("all");
  };

  // Filter đã được xử lý ở server-side qua API query params
  const filteredZones = zones;

  /* ============================
   *  UI
   ============================ */
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/zone" },
            { label: "Quản lý phòng", isCurrent: true },
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
            Thêm khu vực
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <ZoneStatsCards stats={stats} loading={loading} />

      {/* Bộ lọc */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[250px] space-y-2">
            <Label>Tìm kiếm</Label>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <Input
                placeholder="Tìm kiếm khu vực..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white"
              />
              <Button type="submit">Tìm kiếm</Button>
            </form>
          </div>

          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Select value={campusFilter} onValueChange={setCampusFilter}>
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
            <Select value={zoneTypeFilter} onValueChange={setZoneTypeFilter}>
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
            <ClearFiltersButton onClick={handleClearFilters} />
          </div>
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
                const zt =
                  zoneTypeDisplay[z.zoneType as keyof typeof zoneTypeDisplay];

                return (
                  <TableRow key={z._id}>
                    <TableCell className="text-center">{i + 1}</TableCell>
                    <TableCell className="font-medium">{z.name}</TableCell>
                    <TableCell>
                      {zt ? (
                        <Badge
                          className={`flex items-center gap-1 ${zt.color}`}
                        >
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
                      {getActiveStatusBadge(
                        z.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <TableActionMenu
                        showLabel
                        actions={[
                          {
                            label: "Chỉnh sửa",
                            icon: Pencil,
                            onClick: () => setEditZone(z),
                          },
                          {
                            label: "Xóa",
                            icon: Trash2,
                            onClick: () => handleDelete(z._id),
                            variant: "destructive",
                          },
                        ]}
                      />
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
