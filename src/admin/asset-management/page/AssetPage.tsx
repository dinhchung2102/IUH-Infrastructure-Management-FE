"use client";

import {
  ImageOff,
  Plus,
  BarChart3,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
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
import { useState } from "react";
import { useAssetData, useAssetFilters } from "../hooks";
import type { AssetListItem } from "../hooks";

function AssetPage() {
  const { assets, loading, stats, handleDelete, refetchAll } = useAssetData();
  const { filters, handleFiltersChange, handleClearFilters } =
    useAssetFilters();

  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editAsset, setEditAsset] = useState<AssetListItem | null>(null);

  const filteredAssets = assets.filter((a) => {
    const search = filters.search.toLowerCase();
    const matchSearch = a.name?.toLowerCase().includes(search);

    const matchStatus =
      filters.statusFilter === "all" || a.status === filters.statusFilter;

    const matchType =
      filters.typeFilter === "all" ||
      a.assetType?.name?.toLowerCase() === filters.typeFilter.toLowerCase();

    return matchSearch && matchStatus && matchType;
  });

  const handleAddSuccess = () => {
    refetchAll();
  };

  const handleEditSuccess = () => {
    setEditAsset(null);
    refetchAll();
  };

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
            <BarChart3 className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="default"
            onClick={() => setOpenAddDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Thêm thiết bị
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <AssetStatsCards stats={stats} loading={loading} />

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px] space-y-2">
          <Label>Tìm kiếm</Label>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <Input
              placeholder="Tìm kiếm theo tên thiết bị..."
              value={filters.search}
              onChange={(e) => handleFiltersChange({ search: e.target.value })}
              className="bg-white"
            />
            <Button type="submit" className="cursor-pointer">
              Tìm kiếm
            </Button>
          </form>
        </div>

        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select
            value={filters.statusFilter}
            onValueChange={(value) =>
              handleFiltersChange({ statusFilter: value })
            }
          >
            <SelectTrigger className="w-[180px] bg-white cursor-pointer">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem value="IN_USE" className="cursor-pointer">
                Đang sử dụng
              </SelectItem>
              <SelectItem value="MAINTENANCE" className="cursor-pointer">
                Bảo trì
              </SelectItem>
              <SelectItem value="BROKEN" className="cursor-pointer">
                Hư hỏng
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Loại thiết bị</Label>
          <Select
            value={filters.typeFilter}
            onValueChange={(value) =>
              handleFiltersChange({ typeFilter: value })
            }
          >
            <SelectTrigger className="w-[180px] bg-white cursor-pointer">
              <SelectValue placeholder="Tất cả loại thiết bị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Tất cả loại
              </SelectItem>
              <SelectItem value="máy tính" className="cursor-pointer">
                Máy tính
              </SelectItem>
              <SelectItem value="máy in" className="cursor-pointer">
                Máy in
              </SelectItem>
              <SelectItem value="camera" className="cursor-pointer">
                Camera
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

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
                        src={`${import.meta.env.VITE_URL_UPLOADS}${a.image}`}
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
                          <Edit className="mr-2 h-4 w-4" />
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
        onSuccess={handleAddSuccess}
      />

      {editAsset && (
        <AssetAddDialog
          open={!!editAsset}
          onOpenChange={(open) => !open && setEditAsset(null)}
          mode="edit"
          asset={editAsset}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

export default AssetPage;
