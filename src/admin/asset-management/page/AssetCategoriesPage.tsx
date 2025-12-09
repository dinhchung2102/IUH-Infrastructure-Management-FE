"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  BarChart3,
  Plus,
} from "lucide-react";
import { TableSkeleton } from "@/components/TableSkeleton";

import {
  getAssetCategories,
  deleteAssetCategory,
} from "../api/assetCategories.api";
import { AssetCategoryAddDialog } from "../components/AssetCategoryAddDialog";
import { AssetCategoryCards } from "../components/AssetCategoryCards";
import { AssetCategoryStatsDialog } from "../components/AssetCategoryStatsDialog";
import type { AssetCategoryResponse } from "@/admin/asset-management/api/assetCategories.api";

export default function AssetCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statsOpen, setStatsOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAssetCategories();
      if (res?.success) {
        let cats = res.data?.categories || [];
        if (search.trim()) {
          cats = cats.filter((c: any) =>
            c.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        const sorted = [...cats].sort((a, b) => {
          const key = sortBy as keyof AssetCategoryResponse;
          const valA = String(a[key] ?? "");
          const valB = String(b[key] ?? "");
          return sortOrder === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        });

        setCategories(sorted);
      } else {
        toast.error(res?.message || "Không thể tải danh mục thiết bị.");
      }
    } catch {
      toast.error("Lỗi khi tải danh mục.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search, sortBy, sortOrder]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return <ChevronsUpDown className="h-4 w-4" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;
    try {
      const res = await deleteAssetCategory(id);
      if (res?.success) {
        toast.success("Đã xóa danh mục.");
        fetchCategories();
      } else toast.error(res?.message || "Không thể xóa.");
    } catch {
      toast.error("Lỗi khi xóa danh mục.");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCategories();
  };

  // ===== Thống kê =====
  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.status === "ACTIVE").length,
    inactive: categories.filter((c) => c.status === "INACTIVE").length,
    newThisMonth: categories.filter((c) => {
      const created = new Date(c.createdAt);
      const now = new Date();
      return (
        created.getMonth() === now.getMonth() &&
        created.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/asset-categories" },
            { label: "Danh mục thiết bị", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => setStatsOpen(true)}
          >
            <BarChart3 className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            onClick={() => {
              setEditCategory(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Thêm danh mục
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <AssetCategoryCards stats={stats} />

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px] space-y-2">
          <Label>Tìm kiếm</Label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Tìm kiếm danh mục..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" variant="default" className="cursor-pointer">
              Tìm kiếm
            </Button>
          </form>
        </div>
        {search && (
          <Button
            variant="outline"
            onClick={() => setSearch("")}
            className="cursor-pointer"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Bảng danh mục */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">STT</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-8 px-2"
                >
                  Tên danh mục
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Ảnh</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-8 px-2"
                >
                  Trạng thái
                  {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("createdAt")}
                  className="h-8 px-2"
                >
                  Ngày tạo
                  {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableSkeleton
                rows={6}
                columns={[
                  { type: "text", width: "w-[60px]" }, // For STT
                  { type: "text", width: "w-[200px]" },
                  { type: "text", width: "w-[300px]" },
                  { type: "avatar", width: "w-[80px]" },
                  { type: "badge", width: "w-[120px]" },
                  { type: "text", width: "w-[100px]" },
                  { type: "text", width: "w-[60px]" },
                ]}
              />
            )}
            {!loading && categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Không có danh mục nào.
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              categories.map((cat, idx) => (
                <TableRow key={cat._id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground">
                    {cat.description}
                  </TableCell>
                  <TableCell>
                    <img
                      src={cat.image || "/placeholder.png"}
                      alt={cat.name}
                      className="size-12 rounded-md border object-cover"
                    />
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cat.status === "ACTIVE" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {cat.status === "ACTIVE"
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(cat.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setEditCategory(cat);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(cat._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog thêm/sửa */}
      <AssetCategoryAddDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={editCategory ? "edit" : "add"}
        category={editCategory}
        onSuccess={fetchCategories}
      />

      {/* Dialog thống kê */}
      <AssetCategoryStatsDialog
        open={statsOpen}
        onOpenChange={setStatsOpen}
        data={[
          { name: "Hoạt động", count: stats.active },
          { name: "Không hoạt động", count: stats.inactive },
          { name: "Mới tháng này", count: stats.newThisMonth },
        ]}
      />
    </div>
  );
}
