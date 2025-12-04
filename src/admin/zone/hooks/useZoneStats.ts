import { useState, useEffect, useCallback } from "react";
import { getZoneStats } from "../api/zone.api";
import type { ZoneStats } from "../components/ZoneStatsCard";

export function useZoneStats() {
  const [stats, setStats] = useState<ZoneStats | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    refetch: fetchStats,
  };
}
