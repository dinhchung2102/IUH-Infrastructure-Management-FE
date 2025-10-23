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
  CardFooter,
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
import { LayoutGrid, TrendingUp } from "lucide-react";
import { getZoneStats } from "../api/zone.api";

interface ZoneStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ZoneStatsDialog({ open, onOpenChange }: ZoneStatsDialogProps) {
  const [stats, _setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState<string>("ACTIVE");

  // 🟢 Gọi API thống kê zone
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getZoneStats();
      const raw: any = response?.data || {};

      const total = raw.total || 0;
      const byStatus = raw.byStatus || [];

      const formatted = {
        total,
        byStatus: byStatus.map((s: any) => ({
          status: s._id,
          count: s.count,
        })),
      };

      _setStats(formatted);
    } catch (error) {
      console.error("Error fetching zone stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchStats();
  }, [open, fetchStats]);

  // 🧭 Config biểu đồ tròn (Pie chart)
  const statusChartConfig = {
    ACTIVE: { label: "Đang hoạt động", color: "var(--chart-2)" },
    INACTIVE: { label: "Ngừng hoạt động", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  const statusData =
    stats?.byStatus?.map((item: any, index: number) => ({
      status: item.status,
      count: item.count,
      fill: `var(--chart-${index + 2})`,
    })) || [];

  const activeStatusIndex = statusData.findIndex(
    (item: any) => item.status === activeStatus
  );

  // 🟣 Dữ liệu biểu đồ cột
  const timeData = [
    { period: "Tổng", totalZones: stats?.total || 0 },
    ...(stats?.byStatus?.map((s: any) => ({
      period:
        statusChartConfig[s.status as keyof typeof statusChartConfig]?.label ||
        s.status,
      totalZones: s.count,
    })) || []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thống kê Zone</DialogTitle>
          <DialogDescription>
            Xem các biểu đồ và thông tin tổng quan về khu vực / phòng
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="status" className="w-full flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="status">Phân bố trạng thái</TabsTrigger>
            <TabsTrigger value="timeseries">Tổng quan</TabsTrigger>
          </TabsList>

          {/* 🟢 Tab 1: Biểu đồ tròn theo trạng thái */}
          <TabsContent
            value="status"
            className="m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <Card className="border-0 shadow-none h-full flex flex-col">
              <CardContent className="pt-4 pb-2 flex-1">
                {loading ? (
                  <div className="flex justify-center items-center h-[280px]">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-3 h-full">
                    {/* Pie chart */}
                    <div className="flex justify-center col-span-2">
                      <ChartContainer
                        config={statusChartConfig}
                        className="aspect-square w-full max-w-[300px]"
                      >
                        <PieChart width={300} height={300}>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
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
                                <Sector
                                  {...props}
                                  outerRadius={outerRadius + 12}
                                />
                                <Sector
                                  {...props}
                                  outerRadius={outerRadius + 24}
                                  innerRadius={outerRadius + 12}
                                />
                              </g>
                            )}
                            onClick={(data) => {
                              if (data && data.status) {
                                setActiveStatus(data.status);
                              }
                            }}
                          >
                            <Label
                              content={({ viewBox }) => {
                                if (
                                  viewBox &&
                                  "cx" in viewBox &&
                                  "cy" in viewBox
                                ) {
                                  const activeData =
                                    statusData[activeStatusIndex];
                                  const statusLabel =
                                    statusChartConfig[
                                      activeData?.status as keyof typeof statusChartConfig
                                    ]?.label || activeData?.status;
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) - 12}
                                        className="fill-muted-foreground text-xs"
                                      >
                                        {statusLabel}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 20}
                                        className="fill-foreground text-2xl font-bold"
                                      >
                                        {activeData?.count || 0}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 36}
                                        className="fill-muted-foreground text-xs"
                                      >
                                        Zone
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

                    {/* Legend */}
                    <div className="space-y-1 max-h-[280px] overflow-y-auto">
                      {statusData.map((item: any) => (
                        <button
                          key={item.status}
                          onClick={() => setActiveStatus(item.status)}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-colors w-full ${
                            activeStatus === item.status
                              ? "bg-accent"
                              : "hover:bg-accent/50"
                          }`}
                        >
                          <span
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.fill }}
                          />
                          <span className="text-xs font-medium flex-1 text-left">
                            {
                              statusChartConfig[
                                item.status as keyof typeof statusChartConfig
                              ]?.label
                            }
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
              <CardFooter className="flex-col items-center gap-1 text-sm border-t pt-3 bg-muted/30">
                <div className="flex gap-2 items-center font-semibold text-sm">
                  <LayoutGrid className="h-4 w-4" />
                  Phân bố trạng thái Zone
                </div>
                <div className="text-muted-foreground text-xs text-center">
                  Click vào biểu đồ hoặc chú thích để xem chi tiết
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 🟣 Tab 2: Biểu đồ cột tổng quan */}
          <TabsContent
            value="timeseries"
            className="m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <Card className="border-0 shadow-none h-full flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Tổng quan Zone</CardTitle>
                <CardDescription className="text-xs">
                  Số lượng khu vực và phân loại theo trạng thái
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-1">
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ChartContainer
                    config={{
                      totalZones: {
                        label: "Số lượng",
                        color: "var(--chart-1)",
                      },
                    }}
                    className="w-full h-[200px]"
                  >
                    <BarChart
                      data={timeData}
                      width={800}
                      height={200}
                      margin={{ top: 12, left: 12, right: 12, bottom: 12 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="period"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis tick={{ fontSize: 11 }} />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="totalZones"
                        fill="var(--color-totalZones)"
                        radius={8}
                      >
                        <LabelList
                          position="top"
                          offset={8}
                          className="fill-foreground"
                          fontSize={11}
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
              <CardFooter className="flex-col items-center gap-1 text-sm border-t pt-3 bg-muted/30">
                <div className="flex gap-2 items-center font-semibold text-sm">
                  <TrendingUp className="h-4 w-4" />
                  Tổng quan Zone
                </div>
                <div className="text-muted-foreground text-xs text-center">
                  Hiển thị tổng số khu vực và phân loại theo trạng thái
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
