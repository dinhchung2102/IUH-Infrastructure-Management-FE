import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { getCampusStats } from "../api/campus.api";

interface CampusStatusStats {
  total: number;
  byStatus: Array<{
    status: "ACTIVE" | "INACTIVE";
    count: number;
  }>;
}

interface UseCampusStatsDialogOptions {
  open: boolean;
}

/**
 * Custom hook to manage state and logic for Campus stats dialog
 */
export function useCampusStatsDialog({ open }: UseCampusStatsDialogOptions) {
  const [stats, setStats] = useState<CampusStatusStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState<"ACTIVE" | "INACTIVE">(
    "ACTIVE"
  );

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCampusStats();
      if (!response.success || !response.data?.stats) {
        if (!response.success) {
          toast.error(response.message || "Không thể tải thống kê cơ sở.");
        }
        setStats(null);
        return;
      }

      const rawStats = (response.data?.stats ?? {}) as {
        total?: number;
        active?: number;
        inactive?: number;
        newThisMonth?: number;
      };

      const formatted: CampusStatusStats = {
        total: rawStats.total ?? 0,
        byStatus: [
          { status: "ACTIVE", count: rawStats.active ?? 0 },
          { status: "INACTIVE", count: rawStats.inactive ?? 0 },
        ],
      };

      setStats(formatted);
    } catch (error) {
      console.error("Error fetching campus stats:", error);
      toast.error("Không thể tải thống kê cơ sở.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void fetchStats();
    }
  }, [open, fetchStats]);

  // Derived data for charts
  const statusData =
    stats?.byStatus.map((item, index) => ({
      status: item.status,
      count: item.count,
      fill: `var(--chart-${index + 2})`,
    })) || [];

  const activeStatusIndex = statusData.findIndex(
    (item) => item.status === activeStatus
  );

  const timeData = [
    { period: "Tổng", totalCampus: stats?.total || 0 },
    ...(stats?.byStatus.map((s) => ({
      period: s.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động",
      totalCampus: s.count,
    })) || []),
  ];

  return {
    stats,
    loading,
    activeStatus,
    setActiveStatus,
    statusData,
    activeStatusIndex,
    timeData,
  };
}
