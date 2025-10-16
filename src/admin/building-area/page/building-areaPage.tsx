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
import { Badge } from "@/components/ui/badge";
import {
  RefreshCcw,
  Building2,
  Map,
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Quản lý Tòa nhà & Khu vực</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAll}>
            <RefreshCcw className="mr-2 h-4 w-4" /> Làm mới
          </Button>
          <Button onClick={() => setOpenStats(true)} variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" /> Thống kê
          </Button>
          <Button
            onClick={() => {
              setEditingItem(null);
              setOpenAdd(true);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Thêm mới
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <BuildingAreaCards />

      {/* Bộ lọc */}
      <div className="p-4 border bg-white rounded-lg space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2 flex-1 min-w-[260px]">
            <Input
              placeholder="Tìm kiếm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="button">Tìm kiếm</Button>
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BUILDING">🏢 Tòa nhà</SelectItem>
              <SelectItem value="AREA">🌿 Khu vực</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="UNDERMAINTENANCE">Bảo trì</SelectItem>
              <SelectItem value="INACTIVE">Ngừng</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCampus} onValueChange={setFilterCampus}>
            <SelectTrigger className="w-[200px]">
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
                  <TableCell>
                    {item.type === "BUILDING" ? (
                      <Badge variant="secondary">🏢 Tòa nhà</Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Map className="h-3 w-3" /> Khu vực
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{item.campus?.name || "Không rõ"}</TableCell>
                  <TableCell>
                    {item.type === "BUILDING"
                      ? `Tầng: ${item.floor ?? "—"}`
                      : item.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === "ACTIVE"
                          ? "success"
                          : item.status === "UNDERMAINTENANCE"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {item.status === "ACTIVE"
                        ? "Hoạt động"
                        : item.status === "UNDERMAINTENANCE"
                        ? "Bảo trì"
                        : "Ngừng"}
                    </Badge>
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
