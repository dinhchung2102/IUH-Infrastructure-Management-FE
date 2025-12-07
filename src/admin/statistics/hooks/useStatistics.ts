import { useState, useEffect, useCallback } from "react";
import {
  getReportsByPeriod,
  getReportsByType,
  getAuditsByStaff,
  getOverallStatistics,
  getReportsByLocation,
  type ReportsByPeriodData,
  type ReportsByTypeData,
  type AuditByStaffData,
  type OverallStatisticsData,
  type ReportsByLocationData,
} from "../api/statistics.api";
import { toast } from "sonner";

// Helper function to handle nested data structure
function extractData<T>(responseData: T | { data: T }): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as { data: T }).data;
  }
  return responseData;
}

export function useStatistics() {
  const [overallStats, setOverallStats] =
    useState<OverallStatisticsData | null>(null);
  const [reportsByPeriod, setReportsByPeriod] =
    useState<ReportsByPeriodData | null>(null);
  const [reportsByType, setReportsByType] = useState<ReportsByTypeData | null>(
    null
  );
  const [auditsByStaff, setAuditsByStaff] = useState<AuditByStaffData[]>([]);
  const [reportsByLocation, setReportsByLocation] =
    useState<ReportsByLocationData | null>(null);
  const [locationType, setLocationType] = useState<
    "area" | "building" | "zone"
  >("zone");

  const [loading, setLoading] = useState({
    overall: false,
    reportsByPeriod: false,
    reportsByType: false,
    auditsByStaff: false,
    reportsByLocation: false,
  });

  // Fetch overall statistics
  const fetchOverallStats = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, overall: true }));
      const response = await getOverallStatistics();
      if (response.success && response.data) {
        // Handle nested data structure: response.data.data or response.data
        const data = extractData(response.data);
        setOverallStats(data);
      } else {
        toast.error(response.message || "Không thể tải thống kê tổng hợp");
      }
    } catch (error) {
      console.error("Error fetching overall stats:", error);
      toast.error("Lỗi khi tải thống kê tổng hợp");
    } finally {
      setLoading((prev) => ({ ...prev, overall: false }));
    }
  }, []);

  // Fetch reports by period
  const fetchReportsByPeriod = useCallback(
    async (params?: {
      period?: "week" | "month" | "year";
      startDate?: string;
      endDate?: string;
    }) => {
      try {
        setLoading((prev) => ({ ...prev, reportsByPeriod: true }));
        const response = await getReportsByPeriod(params);
        if (response.success && response.data) {
          // Handle nested data structure: response.data.data or response.data
          const data = extractData(response.data);
          setReportsByPeriod(data);
        } else {
          toast.error(
            response.message || "Không thể tải thống kê báo cáo theo thời gian"
          );
        }
      } catch (error) {
        console.error("Error fetching reports by period:", error);
        toast.error("Lỗi khi tải thống kê báo cáo theo thời gian");
      } finally {
        setLoading((prev) => ({ ...prev, reportsByPeriod: false }));
      }
    },
    []
  );

  // Fetch reports by type
  const fetchReportsByType = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, reportsByType: true }));
      const response = await getReportsByType();
      if (response.success && response.data) {
        // Handle nested data structure: response.data.data or response.data
        const data = extractData(response.data);
        setReportsByType(data);
      } else {
        toast.error(
          response.message || "Không thể tải thống kê báo cáo theo loại"
        );
      }
    } catch (error) {
      console.error("Error fetching reports by type:", error);
      toast.error("Lỗi khi tải thống kê báo cáo theo loại");
    } finally {
      setLoading((prev) => ({ ...prev, reportsByType: false }));
    }
  }, []);

  // Fetch audits by staff
  const fetchAuditsByStaff = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, auditsByStaff: true }));
      const response = await getAuditsByStaff();
      if (response.success && response.data) {
        // Handle nested data structure: response.data.data or response.data
        const data = extractData(response.data);
        setAuditsByStaff(Array.isArray(data) ? data : []);
      } else {
        toast.error(
          response.message || "Không thể tải thống kê nhiệm vụ theo nhân viên"
        );
      }
    } catch (error) {
      console.error("Error fetching audits by staff:", error);
      toast.error("Lỗi khi tải thống kê nhiệm vụ theo nhân viên");
    } finally {
      setLoading((prev) => ({ ...prev, auditsByStaff: false }));
    }
  }, []);

  // Fetch reports by location
  const fetchReportsByLocation = useCallback(
    async (type: "area" | "building" | "zone") => {
      try {
        setLoading((prev) => ({ ...prev, reportsByLocation: true }));
        const response = await getReportsByLocation(type);
        if (response.success && response.data) {
          // Handle nested data structure: response.data.data or response.data
          const data = extractData(response.data);
          setReportsByLocation(data);
        } else {
          toast.error(
            response.message || "Không thể tải thống kê báo cáo theo khu vực"
          );
        }
      } catch (error) {
        console.error("Error fetching reports by location:", error);
        toast.error("Lỗi khi tải thống kê báo cáo theo khu vực");
      } finally {
        setLoading((prev) => ({ ...prev, reportsByLocation: false }));
      }
    },
    []
  );

  // Load all statistics on mount
  useEffect(() => {
    fetchOverallStats();
    fetchReportsByPeriod({ period: "month" });
    fetchReportsByType();
    fetchAuditsByStaff();
    fetchReportsByLocation(locationType);
  }, [
    fetchOverallStats,
    fetchReportsByPeriod,
    fetchReportsByType,
    fetchAuditsByStaff,
    fetchReportsByLocation,
    locationType,
  ]);

  return {
    // Data
    overallStats,
    reportsByPeriod,
    reportsByType,
    auditsByStaff,
    reportsByLocation,
    locationType,
    setLocationType,

    // Loading states
    loading,

    // Refetch functions
    refetchOverallStats: fetchOverallStats,
    refetchReportsByPeriod: fetchReportsByPeriod,
    refetchReportsByType: fetchReportsByType,
    refetchAuditsByStaff: fetchAuditsByStaff,
    refetchReportsByLocation: fetchReportsByLocation,
  };
}
