import { useEffect, useState, useCallback } from "react";
import {
  getAccountStats,
  type AccountStatistics,
} from "../api/account-stats.api";

export function useAccountStats() {
  const [stats, setStats] = useState<AccountStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAccountStats();
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
