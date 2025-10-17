import { useEffect, useState, useCallback } from "react";
import { getStaffStats, type StaffStatistics } from "../api/staff-stats.api";

export function useStaffStats() {
  const [stats, setStats] = useState<StaffStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getStaffStats();
      setStats(response.data || null);
    } catch (err) {
      setError(err as Error);
      setStats(null);
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
    error,
    refetch: fetchStats,
  };
}
