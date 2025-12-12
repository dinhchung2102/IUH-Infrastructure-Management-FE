import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { DashboardStatsTab } from "../components/DashboardStatsTab";
import { TimeSeriesTab } from "../components/TimeSeriesTab";
import { LocationStatsTab } from "../components/LocationStatsTab";
import { TopAssetsTab } from "../components/TopAssetsTab";
import { TopReportersTab } from "../components/TopReportersTab";
import { PeriodStatsTab } from "../components/PeriodStatsTab";

export default function ReportStatisticsPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-2">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Quản lý", href: "/admin/reports" },
            { label: "Thống kê báo cáo", isCurrent: true },
          ]}
        />
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Tổng quan</TabsTrigger>
          <TabsTrigger value="time-series">Xu hướng</TabsTrigger>
          <TabsTrigger value="location">Theo vị trí</TabsTrigger>
          <TabsTrigger value="top-assets">
            Thiết bị có nhiều báo cáo nhất
          </TabsTrigger>
          <TabsTrigger value="top-reporters">
            Người báo cáo nhiều nhất
          </TabsTrigger>
          <TabsTrigger value="period">Khoảng thời gian</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardStatsTab />
        </TabsContent>
        <TabsContent value="time-series" className="mt-6">
          <TimeSeriesTab />
        </TabsContent>
        <TabsContent value="location" className="mt-6">
          <LocationStatsTab />
        </TabsContent>
        <TabsContent value="top-assets" className="mt-6">
          <TopAssetsTab />
        </TabsContent>
        <TabsContent value="top-reporters" className="mt-6">
          <TopReportersTab />
        </TabsContent>
        <TabsContent value="period" className="mt-6">
          <PeriodStatsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
