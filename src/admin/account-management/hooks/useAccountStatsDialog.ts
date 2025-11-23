import { useCallback, useEffect, useState } from "react";
import {
  getAccountStats,
  type AccountStatistics,
} from "../api/account-stats.api";

export type TimeType = "month" | "date" | "quarter" | "year";

interface UseAccountStatsDialogOptions {
  open: boolean;
}

/**
 * Custom hook to manage state and logic for Account Stats Dialog
 */
export function useAccountStatsDialog({ open }: UseAccountStatsDialogOptions) {
  const [stats, setStats] = useState<AccountStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeType, setTimeType] = useState<TimeType>("month");
  const [activeRole, setActiveRole] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAccountStats({ type: timeType });
      setStats(response.data || null);

      if (response.data?.accountsByRole?.length) {
        setActiveRole(response.data.accountsByRole[0].role);
      }
    } catch (error) {
      console.error("Error fetching account stats for dialog:", error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [timeType]);

  useEffect(() => {
    if (open) {
      void fetchStats();
    }
  }, [open, fetchStats]);

  return {
    stats,
    loading,
    timeType,
    setTimeType,
    activeRole,
    setActiveRole,
  };
}
