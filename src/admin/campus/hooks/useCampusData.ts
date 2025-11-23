import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteCampus,
  getCampus,
  getCampusStats,
  updateCampus,
} from "../api/campus.api";
import type { Campus } from "../components/CampusTable";
import type { CampusStats } from "../components/CampusStatsCards";

/**
 * Custom hook to handle data fetching and mutations for Campus
 */
export function useCampusData() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CampusStats | undefined>(undefined);

  const fetchCampus = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCampus({});
      if (!res.success) {
        toast.error(res.message || "Không thể tải danh sách cơ sở.");
        setCampuses([]);
        return;
      }
      const list = (res.data?.campuses || []) as Campus[];
      setCampuses(list);
    } catch (err: unknown) {
      console.error("Lỗi khi tải cơ sở:", err);
      toast.error("Không thể tải danh sách cơ sở.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await getCampusStats();
      if (!res.success || !res.data?.stats) {
        if (!res.success) {
          toast.error(res.message || "Không thể tải thống kê cơ sở.");
        }
        setStats(undefined);
        return;
      }

      setStats({
        totalCampus: res.data.stats.total || 0,
        activeCampus: res.data.stats.active || 0,
        inactiveCampus: res.data.stats.inactive || 0,
        newCampusThisMonth: res.data.stats.newThisMonth || 0,
      });
    } catch (err: unknown) {
      console.error("Lỗi khi tải thống kê:", err);
      toast.error("Không thể tải thống kê cơ sở.");
      setStats(undefined);
    }
  }, []);

  useEffect(() => {
    fetchCampus();
    fetchStats();
  }, [fetchCampus, fetchStats]);

  const handleDelete = async (id: string) => {
    if (!id) return toast.error("Không tìm thấy ID cơ sở.");
    const confirmDelete = confirm("Bạn có chắc muốn xóa cơ sở này?");

    if (!confirmDelete) return;

    try {
      const res = await deleteCampus(id);
      if (res.success) {
        toast.success(res.message || "Đã xóa cơ sở thành công!");
        fetchCampus();
        fetchStats();
      } else {
        toast.error(res.message || "Không thể xóa cơ sở.");
      }
    } catch (err: unknown) {
      console.error("Lỗi khi xóa cơ sở:", err);
      toast.error("Có lỗi xảy ra khi xóa cơ sở.");
    }
  };

  const handleToggleStatus = async (campus: Campus) => {
    if (!campus?._id) return toast.error("Không tìm thấy ID cơ sở.");

    const newStatus = campus.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const actionText = campus.status === "ACTIVE" ? "tạm ngưng" : "kích hoạt";
    const confirmAction = confirm(
      `Bạn có chắc muốn ${actionText} cơ sở "${campus.name}"?`
    );

    if (!confirmAction) return;

    try {
      const res = await updateCampus(campus._id, { status: newStatus });
      if (res.success) {
        toast.success(
          res.message || `Đã ${actionText} cơ sở "${campus.name}" thành công!`
        );
        fetchCampus();
        fetchStats();
      } else {
        toast.error(res.message || `Không thể ${actionText} cơ sở này.`);
      }
    } catch (err: unknown) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      toast.error(`Không thể ${actionText} cơ sở này.`);
    }
  };

  const refetchAll = () => {
    fetchCampus();
    fetchStats();
  };

  return {
    campuses,
    loading,
    stats,
    handleDelete,
    handleToggleStatus,
    refetchAll,
  };
}
