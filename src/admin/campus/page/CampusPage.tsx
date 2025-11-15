"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getCampus, deleteCampus, getCampusStats, updateCampus } from "../api/campus.api";
import { Plus, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { CampusStatsCards } from "../components/CampusStatsCards";
import { CampusStatsDialog } from "../components/CampusStatsDialog";
import { CampusAddDialog } from "../components/CampusAddDialog";
import { CampusFilters } from "../components/CampusFilters";
import { CampusTable } from "../components/CampusTable";

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
      // Response có cấu trúc: { stats: { total, active, inactive, newThisMonth } }
      if (res?.stats) {
        setStats({
          totalCampus: res.stats.total || 0,
          activeCampus: res.stats.active || 0,
          inactiveCampus: res.stats.inactive || 0,
          newCampusThisMonth: res.stats.newThisMonth || 0,
        });
      } else {
        setStats(null);
      }
    } catch (err) {
      console.error("Lỗi khi tải thống kê:", err);
      setStats(null);
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

  const handleToggleStatus = async (campus: any) => {
    if (!campus?._id) return toast.error("Không tìm thấy ID cơ sở.");

    const newStatus = campus.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = campus.status === "ACTIVE" ? "tạm ngưng" : "kích hoạt";
    const confirmAction = confirm(
      `Bạn có chắc muốn ${actionText} cơ sở "${campus.name}"?`
    );

    if (!confirmAction) return;

    try {
      await updateCampus(campus._id, { status: newStatus });
      toast.success(
        `Đã ${actionText} cơ sở "${campus.name}" thành công!`
      );
      fetchCampus();
      fetchStats();
    } catch (err: any) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      toast.error(`Không thể ${actionText} cơ sở này.`);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setManagerFilter("all");
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

    return matchSearch && matchStatus && matchManager;
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
            <BarChart3 className="h-4 w-4" />
            Xem thống kê
          </Button>
          <Button
            className="flex-1 md:flex-initial cursor-pointer"
            variant="default"
            onClick={() => setOpenAddDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Thêm cơ sở
          </Button>
        </div>
      </div>

      {/* Cards thống kê */}
      <CampusStatsCards stats={stats} loading={loading} />

      {/* Bộ lọc */}
      <CampusFilters
        search={search}
        statusFilter={statusFilter}
        managerFilter={managerFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
        onManagerFilterChange={setManagerFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Bảng dữ liệu */}
      <CampusTable
        campuses={filteredCampuses}
        loading={loading}
        onEdit={setEditCampus}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

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
