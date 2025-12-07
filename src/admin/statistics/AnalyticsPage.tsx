import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStatistics } from "./hooks";
import {
  AnalyticsHeader,
  SummaryCards,
  ReportsTab,
  AuditsTab,
  LocationsTab,
  AnalyticsTabs,
  AnalyticsTabsList,
  AnalyticsTabsTrigger,
  AnalyticsTabsContent,
} from "./components";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const {
    overallStats,
    reportsByPeriod,
    reportsByType,
    auditsByStaff,
    reportsByLocation,
    locationType,
    setLocationType,
    loading,
    refetchReportsByPeriod,
  } = useStatistics();

  // Refetch reports by period when period changes
  useEffect(() => {
    refetchReportsByPeriod({ period });
  }, [period, refetchReportsByPeriod]);

  return (
    <div className="space-y-6">
      <AnalyticsHeader />

      <SummaryCards overallStats={overallStats} loading={loading.overall} />

      <AnalyticsTabs defaultValue="reports" className="w-full">
        <div className="flex items-center justify-between pb-0">
          <AnalyticsTabsList>
            <AnalyticsTabsTrigger value="reports">
              Thống kê Báo cáo sự cố
            </AnalyticsTabsTrigger>
            <AnalyticsTabsTrigger value="audits">
              Nhiệm vụ theo nhân viên
            </AnalyticsTabsTrigger>
            <AnalyticsTabsTrigger value="locations">
              Khu vực được báo cáo nhiều nhất
            </AnalyticsTabsTrigger>
          </AnalyticsTabsList>
          <Select
            value={period}
            onValueChange={(v: "week" | "month" | "year") => setPeriod(v)}
          >
            <SelectTrigger className="w-[180px] bg-white cursor-pointer font-medium border-border shadow-sm">
              <SelectValue
                placeholder="Chọn khoảng thời gian"
                className="font-medium"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week" className="cursor-pointer font-medium">
                Theo tuần
              </SelectItem>
              <SelectItem value="month" className="cursor-pointer font-medium">
                Theo tháng
              </SelectItem>
              <SelectItem value="year" className="cursor-pointer font-medium">
                Theo năm
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <AnalyticsTabsContent value="reports" className="space-y-4">
          <ReportsTab
            period={period}
            reportsByPeriod={reportsByPeriod}
            reportsByType={reportsByType}
            loading={{
              reportsByPeriod: loading.reportsByPeriod,
              reportsByType: loading.reportsByType,
            }}
          />
        </AnalyticsTabsContent>

        <AnalyticsTabsContent value="audits" className="space-y-4">
          <AuditsTab
            auditsByStaff={auditsByStaff}
            loading={loading.auditsByStaff}
          />
        </AnalyticsTabsContent>

        <AnalyticsTabsContent value="locations" className="space-y-4">
          <LocationsTab
            reportsByLocation={reportsByLocation}
            locationType={locationType}
            onLocationTypeChange={setLocationType}
            loading={loading.reportsByLocation}
          />
        </AnalyticsTabsContent>
      </AnalyticsTabs>
    </div>
  );
}
