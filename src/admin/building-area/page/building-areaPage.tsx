"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getBuildings, deleteBuilding } from "../api/building.api";
import { getAreas, deleteArea } from "../api/area.api";
import { getCampus } from "../../campus/api/campus.api";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { RefreshCcw, BarChart3, Plus } from "lucide-react";
import { BuildingAreaCards } from "../components/BuildingAreaCards";
import { BuildingAreaAddDialog } from "../components/BuildingAreaAddDialog";
import { BuildingAreaStatsDialog } from "../components/BuildingAreaStatsDialog";
import { BuildingAreaFilters } from "../components/BuildingAreaFilters";
import { BuildingAreaTable } from "../components/BuildingAreaTable";

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
      toast.error("Không thể tải danh sách tòa nhà và khu vực ngoài trời");
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
          item.type === "BUILDING" ? "tòa nhà" : "khu vực ngoài trời"
        } "${item.name}" không?`
      );
      if (!confirm) return;

      if (item.type === "BUILDING") {
        await deleteBuilding(item._id);
      } else {
        await deleteArea(item._id);
      }

      toast.success(
        `Đã xóa ${
          item.type === "BUILDING" ? "tòa nhà" : "khu vực ngoài trời"
        } thành công`
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
            { label: "Quản lý Tòa nhà & Khu vực ngoài trời", isCurrent: true },
          ]}
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={fetchAll}
          >
            <RefreshCcw className="h-4 w-4" />
            Làm mới
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="outline"
            onClick={() => setOpenStats(true)}
          >
            <BarChart3 className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            onClick={() => {
              setEditingItem(null);
              setOpenAdd(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Thêm tòa nhà / Khu vực ngoài trời
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <BuildingAreaCards stats={undefined} loading={false} />

      {/* Bộ lọc */}
      <BuildingAreaFilters
        search={search}
        filterType={filterType}
        filterStatus={filterStatus}
        filterCampus={filterCampus}
        campuses={campuses}
        onSearchChange={setSearch}
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
        onFilterCampusChange={setFilterCampus}
        onClearFilters={handleClearFilters}
      />

      {/* Bảng dữ liệu */}
      <BuildingAreaTable
        items={filtered}
        loading={loading}
        onEdit={(item) => {
          setEditingItem(item);
          setOpenAdd(true);
        }}
        onDelete={handleDelete}
      />

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
