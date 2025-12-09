import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStatsTab } from "./DashboardStatsTab";
import { TimeSeriesTab } from "./TimeSeriesTab";
import { LocationStatsTab } from "./LocationStatsTab";
import { TopAssetsTab } from "./TopAssetsTab";
import { TopReportersTab } from "./TopReportersTab";
import { PeriodStatsTab } from "./PeriodStatsTab";

interface ReportStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportStatsDialog({
  open,
  onOpenChange,
}: ReportStatsDialogProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thống kê báo cáo chi tiết</DialogTitle>
          <DialogDescription>
            Xem các thống kê và biểu đồ chi tiết về báo cáo sự cố
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Tổng quan</TabsTrigger>
            <TabsTrigger value="time-series">Xu hướng</TabsTrigger>
            <TabsTrigger value="location">Theo vị trí</TabsTrigger>
            <TabsTrigger value="top-assets">Top Assets</TabsTrigger>
            <TabsTrigger value="top-reporters">Top Reporters</TabsTrigger>
            <TabsTrigger value="period">Khoảng thời gian</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="dashboard" className="mt-0">
              <DashboardStatsTab />
            </TabsContent>
            <TabsContent value="time-series" className="mt-0">
              <TimeSeriesTab />
            </TabsContent>
            <TabsContent value="location" className="mt-0">
              <LocationStatsTab />
            </TabsContent>
            <TabsContent value="top-assets" className="mt-0">
              <TopAssetsTab />
            </TabsContent>
            <TabsContent value="top-reporters" className="mt-0">
              <TopReportersTab />
            </TabsContent>
            <TabsContent value="period" className="mt-0">
              <PeriodStatsTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
