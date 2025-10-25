"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Label,
  Sector,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

import { getAssetStatsDashboard } from "../api/stats.api";
import type { AssetDashboardStats } from "../api/stats.api";

interface AssetStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetStatsDialog({ open, onOpenChange }: AssetStatsDialogProps) {
  const [stats, setStats] = useState<AssetDashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string>("IN_USE");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAssetStatsDashboard();
      // 🔹 Lấy dữ liệu từ res.data.data
      setStats(res?.data ?? null);

    } catch (err) {
      console.error("Error fetching asset stats:", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchStats();
  }, [open, fetchStats]);

  // 🔹 Chuyển assetsByStatus thành array để dùng Pie chart
  const statusData = stats
    ? Object.entries(stats.assetsByStatus).map(([status, count], index) => ({
        status,
        count,
        fill: `var(--chart-${index + 2})`,
      }))
    : [];

  const activeStatusIndex = statusData.findIndex((item) => item.status === activeStatus);

  const statusChartConfig = {
    NEW: { label: "Mới", color: "var(--chart-1)" },
    IN_USE: { label: "Đang sử dụng", color: "var(--chart-2)" },
    UNDER_MAINTENANCE: { label: "Đang bảo trì", color: "var(--chart-3)" },
    DAMAGED: { label: "Hư hỏng", color: "var(--chart-4)" },
    LOST: { label: "Mất", color: "var(--chart-5)" },
    DISPOSED: { label: "Đã thanh lý", color: "var(--chart-6)" },
    TRANSFERRED: { label: "Chuyển đi", color: "var(--chart-7)" },
  } satisfies ChartConfig;

  // 🔹 Dữ liệu Bar chart tổng quan
  const timeData = [
    { period: "Tổng thiết bị", totalAssets: stats?.totalAssets ?? 0 },
    ...statusData.map((s) => ({
      period: statusChartConfig[s.status as keyof typeof statusChartConfig]?.label ?? s.status,
      totalAssets: s.count,
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thống kê thiết bị</DialogTitle>
          <DialogDescription>
            Xem biểu đồ và thông tin tổng quan về thiết bị
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="status" className="w-full flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="status">Phân bố trạng thái</TabsTrigger>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          </TabsList>

          {/* Tab 1: Pie chart */}
          <TabsContent value="status" className="m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <Card className="border-0 shadow-none h-full flex flex-col">
              <CardContent className="pt-4 pb-2 flex-1">
                {loading ? (
                  <div className="flex justify-center items-center h-[280px]">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-3 h-full">
                    <div className="flex justify-center col-span-2">
                      <ChartContainer
                        config={statusChartConfig}
                        className="aspect-square w-full max-w-[300px]"
                      >
                        <PieChart width={300} height={300}>
                          <Pie
                            data={statusData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={50}
                            outerRadius={110}
                            strokeWidth={5}
                            activeIndex={activeStatusIndex}
                            activeShape={({ outerRadius = 0, ...props }) => (
                              <g>
                                <Sector {...props} outerRadius={outerRadius + 12} />
                                <Sector {...props} outerRadius={outerRadius + 24} innerRadius={outerRadius + 12} />
                              </g>
                            )}
                            onClick={(data) => {
                              if (data && "status" in data) setActiveStatus(data.status);
                            }}
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                  const activeData = statusData[activeStatusIndex];
                                  const statusLabel = statusChartConfig[activeData?.status as keyof typeof statusChartConfig]?.label ?? activeData?.status;
                                  return (
                                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 12} className="fill-muted-foreground text-xs">
                                        {statusLabel}
                                      </tspan>
                                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-foreground text-2xl font-bold">
                                        {activeData?.count || 0}
                                      </tspan>
                                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 36} className="fill-muted-foreground text-xs">
                                        Thiết bị
                                      </tspan>
                                    </text>
                                  );
                                }
                              }}
                            />
                          </Pie>
                        </PieChart>
                      </ChartContainer>
                    </div>

                    <div className="space-y-1 max-h-[280px] overflow-y-auto">
                      {statusData.map((item) => (
                        <button
                          key={item.status}
                          onClick={() => setActiveStatus(item.status)}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-colors w-full ${
                            activeStatus === item.status ? "bg-accent" : "hover:bg-accent/50"
                          }`}
                        >
                          <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                          <span className="text-xs font-medium flex-1 text-left">
                            {statusChartConfig[item.status as keyof typeof statusChartConfig]?.label ?? item.status}
                          </span>
                          <span className="text-xs text-muted-foreground font-bold bg-muted px-1.5 py-0.5 rounded">
                            {item.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Bar chart */}
          <TabsContent value="overview" className="m-0 data-[state=active]:flex data-[state=active]:flex-col">
            <Card className="border-0 shadow-none h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tổng quan thiết bị</CardTitle>
                <CardDescription className="text-xs">
                  Số lượng thiết bị hiện tại và theo trạng thái
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ChartContainer config={{ totalAssets: { label: "Số lượng", color: "var(--chart-1)" } }} className="w-full h-[200px]">
                    <BarChart data={timeData} width={800} height={200} margin={{ top: 12, left: 12, right: 12, bottom: 12 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={10} tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                      <Bar dataKey="totalAssets" fill="var(--color-totalAssets)" radius={8}>
                        <LabelList position="top" offset={8} className="fill-foreground" fontSize={11} />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
