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
      // Transform API response to component format
      if (response?.data?.stats) {
        setStats({
          totalAccounts: response.data.stats.total || 0,
          activeAccounts: response.data.stats.active || 0,
          inactiveAccounts: response.data.stats.inactive || 0,
          newAccountsThisMonth: response.data.stats.newThisMonth || 0,
        });
      } else {
        setStats(null);
      }
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
