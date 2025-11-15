"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getAssets, deleteAsset, getAssetStats } from "../api/asset.api";
import {
  ImageOff,
  Plus,
  BarChart3,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
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
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { AssetStatsCards } from "../components/AssetStatsCards";
import { AssetStatsDialog } from "../components/AssetStatsDialog";
import { AssetAddDialog } from "../components/AssetAddDialog";
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

function AssetPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editAsset, setEditAsset] = useState<any>(null);

  /** =========================
   * Fetch API
   * ========================= */
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAssets();
      const list = res?.data?.assets || [];
      setAssets(list);
    } catch (err) {
      console.error("Lỗi khi tải thiết bị:", err);
      toast.error("Không thể tải danh sách thiết bị.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getAssetStats();
      setStats(res?.data || null);
    } catch (err) {
      console.error("Lỗi khi tải thống kê thiết bị:", err);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
    fetchStats();
  }, [fetchAssets, fetchStats]);

  /** =========================
   * Handlers
   * ========================= */
  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Không tìm thấy thiết bị.");
    const confirmDelete = confirm("Bạn có chắc muốn xóa thiết bị này?");
    if (!confirmDelete) return;

    try {
      await deleteAsset(id);
      toast.success("Đã xóa thiết bị thành công!");
      fetchAssets();
      fetchStats();
    } catch (err: any) {
      console.error("Lỗi khi xóa thiết bị:", err);
      toast.error("Không thể xóa thiết bị này.");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  /** =========================
   * Filter logic
   * ========================= */
  const filteredAssets = assets.filter((a) => {
    const matchSearch = a.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    const matchType =
      typeFilter === "all" ||
      a.assetType?.name?.toLowerCase() === typeFilter.toLowerCase();
    return matchSearch && matchStatus && matchType;
  });

  /** =========================
   * UI
   * ========================= */
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/assets" },
            { label: "Quản lý thiết bị", isCurrent: true },
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
            Thêm thiết bị
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <AssetStatsCards stats={stats} loading={loading} />

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 min-w-[250px] flex gap-2"
        >
          <Input
            placeholder="Tìm kiếm theo tên thiết bị..."
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
            <SelectItem value="IN_USE">Đang sử dụng</SelectItem>
            <SelectItem value="MAINTENANCE">Bảo trì</SelectItem>
            <SelectItem value="BROKEN">Hư hỏng</SelectItem>
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Tất cả loại thiết bị" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="máy tính">Máy tính</SelectItem>
            <SelectItem value="máy in">Máy in</SelectItem>
            <SelectItem value="camera">Camera</SelectItem>
          </SelectContent>
        </Select>

        <ClearFiltersButton onClick={handleClearFilters} />
      </div>

      {/* Bảng thiết bị */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">STT</TableHead>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Khu vực</TableHead>
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
                  { type: "avatar" },
                  { type: "text" },
                  { type: "text" },
                  { type: "text" },
                  { type: "badge" },
                  { type: "text" },
                ]}
              />
            )}

            {!loading && filteredAssets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Không có thiết bị nào phù hợp.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              filteredAssets.map((a, i) => (
                <TableRow key={a._id}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell>
                    {a.image ? (
                      <img
                        src={a.image}
                        alt={a.name}
                        className="size-12 rounded-md object-cover border"
                      />
                    ) : (
                      <div className="flex items-center justify-center size-12 bg-muted rounded-md text-muted-foreground">
                        <ImageOff className="size-5" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.assetType?.name || "—"}</TableCell>
                  <TableCell>{a.zone?.name || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        a.status === "IN_USE"
                          ? "success"
                          : a.status === "MAINTENANCE"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {a.status === "IN_USE"
                        ? "Đang sử dụng"
                        : a.status === "MAINTENANCE"
                        ? "Bảo trì"
                        : "Hư hỏng"}
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
                          onClick={() => setEditAsset(a)}
                          className="cursor-pointer"
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(a._id)}
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
      <AssetStatsDialog
        open={openStatsDialog}
        onOpenChange={setOpenStatsDialog}
      />

      {/* Dialog thêm thiết bị */}
      <AssetAddDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        mode="add"
        onSuccess={() => {
          fetchAssets();
          fetchStats();
        }}
      />

      {editAsset && (
        <AssetAddDialog
          open={!!editAsset}
          onOpenChange={(open) => !open && setEditAsset(null)}
          mode="edit"
          asset={editAsset}
          onSuccess={() => {
            setEditAsset(null);
            fetchAssets();
            fetchStats();
          }}
        />
      )}
    </div>
  );
}

export default AssetPage;
