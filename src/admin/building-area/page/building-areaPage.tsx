"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getBuildings, deleteBuilding } from "../api/building.api";
import { getAreas, deleteArea } from "../api/area.api";
import { getCampus } from "../../campus/api/campus.api";
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
import {
  getActiveStatusBadge,
  getBuildingAreaTypeBadge,
} from "@/config/badge.config";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  RefreshCcw,
  PlusCircle,
  BarChart3,
  Edit3,
  XCircle,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { BuildingAreaCards } from "../components/BuildingAreaCards";
import { BuildingAreaAddDialog } from "../components/BuildingAreaAddDialog";
import { BuildingAreaStatsDialog } from "../components/BuildingAreaStatsDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BuildingAreaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Bộ lọc
  const [filterType, setFilterType] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCampus, setFilterCampus] = useState<string>("");

  /** ==========================
   *  FETCH BUILDING + AREA
   *  ========================== */
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [buildRes, areaRes] = await Promise.all([
        getBuildings(),
        getAreas(),
      ]);

      const buildingsData = buildRes?.data?.buildings || buildRes?.data || [];
      const buildings = Array.isArray(buildingsData)
        ? buildingsData.map((b: any) => ({
            ...b,
            type: "BUILDING",
          }))
        : buildingsData.buildings.map((b: any) => ({
            ...b,
            type: "BUILDING",
          }));

      const areasData = areaRes?.data?.areas || areaRes?.data || [];
      const areas = Array.isArray(areasData)
        ? areasData.map((a: any) => ({ ...a, type: "AREA" }))
        : areasData.areas.map((a: any) => ({ ...a, type: "AREA" }));

      setItems([...buildings, ...areas]);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách tòa nhà và khu vực");
    } finally {
      setLoading(false);
    }
  };

  /** ==========================
   *  FETCH CAMPUSES
   *  ========================== */
  const fetchCampuses = async () => {
    try {
      const res = await getCampus();
      const list = res?.data?.campuses || [];
      setCampuses(list);
    } catch (err) {
      console.error("Lỗi tải cơ sở:", err);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchCampuses();
  }, []);

  /** ==========================
   *  DELETE ITEM
   *  ========================== */
  const handleDelete = async (item: any) => {
    try {
      const confirm = window.confirm(
        `Bạn có chắc chắn muốn xóa ${
          item.type === "BUILDING" ? "tòa nhà" : "khu vực"
        } "${item.name}" không?`
      );
      if (!confirm) return;

      if (item.type === "BUILDING") {
        await deleteBuilding(item._id);
      } else {
        await deleteArea(item._id);
      }

      toast.success(
        `Đã xóa ${item.type === "BUILDING" ? "tòa nhà" : "khu vực"} thành công`
      );
      fetchAll();
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại, vui lòng thử lại");
    }
  };

  /** ==========================
   *  FILTER
   *  ========================== */
  const filtered = items.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesType = filterType ? item.type === filterType : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    const matchesCampus = filterCampus
      ? item.campus?._id === filterCampus
      : true;
    return matchesSearch && matchesType && matchesStatus && matchesCampus;
  });

  const handleClearFilters = () => {
    setSearch("");
    setFilterType("");
    setFilterStatus("");
    setFilterCampus("");
  };

  /** ==========================
   *  RENDER
   *  ========================== */
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/building-area" },
            { label: "Quản lý Tòa nhà & Khu vực", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={fetchAll}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => setOpenStats(true)}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            onClick={() => {
              setEditingItem(null);
              setOpenAdd(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <BuildingAreaCards stats={undefined} loading={false} />

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex-1 min-w-[250px] flex gap-2"
        >
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit">Tìm kiếm</Button>
        </form>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Chọn loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BUILDING">🏢 Tòa nhà</SelectItem>
            <SelectItem value="AREA">🌿 Khu vực</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Hoạt động</SelectItem>
            <SelectItem value="UNDERMAINTENANCE">Bảo trì</SelectItem>
            <SelectItem value="INACTIVE">Ngừng</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterCampus} onValueChange={setFilterCampus}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Chọn cơ sở" />
          </SelectTrigger>
          <SelectContent>
            {campuses.length > 0 ? (
              campuses.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-data" disabled>
                Không có dữ liệu
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="outline"
          onClick={handleClearFilters}
          className="flex items-center gap-2"
        >
          <XCircle className="h-4 w-4" />
          Xóa bộ lọc
        </Button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-12">STT</TableHead>
              <TableHead>Tên</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Cơ sở</TableHead>
              <TableHead>Chi tiết</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center w-20">Thao tác</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item, i) => (
                <TableRow key={item._id}>
                  <TableCell className="text-center">{i + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{getBuildingAreaTypeBadge(item.type)}</TableCell>
                  <TableCell>{item.campus?.name || "Không rõ"}</TableCell>
                  <TableCell>
                    {item.type === "BUILDING"
                      ? `Tầng: ${item.floor ?? "—"}`
                      : item.description || "—"}
                  </TableCell>
                  <TableCell>
                    {getActiveStatusBadge(
                      item.status === "UNDERMAINTENANCE"
                        ? "UNDERMAINTENANCE"
                        : item.status === "ACTIVE"
                        ? "ACTIVE"
                        : "INACTIVE"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingItem(item);
                            setOpenAdd(true);
                          }}
                        >
                          <Edit3 className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
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

      {/* Dialog thêm/sửa */}
      <BuildingAreaAddDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onSuccess={fetchAll}
        mode={editingItem ? "edit" : "add"}
        item={editingItem}
        campuses={campuses}
      />

      {/* Dialog thống kê */}
      <BuildingAreaStatsDialog open={openStats} onOpenChange={setOpenStats} />
    </div>
  );
}
