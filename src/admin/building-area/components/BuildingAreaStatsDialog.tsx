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
  Sector,
  Label,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Building2 } from "lucide-react";
import { getBuildingAreaStats } from "@/admin/building-area/api/building-area.api";
import type { BuildingAreaStats } from "@/admin/building-area/api/building-area.api";

export function BuildingAreaStatsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BuildingAreaStats | null>(null);
  const [activeType, setActiveType] = useState<"BUILDING" | "AREA">("BUILDING");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBuildingAreaStats();
      setStats(res);
    } catch (err) {
      console.error("❌ Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchStats();
  }, [open, fetchStats]);

  if (!stats) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đang tải dữ liệu...</DialogTitle>
          </DialogHeader>
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </DialogContent>
      </Dialog>
    );
  }

  /* ============================
   * 🔹 Pie Chart: Phân loại
   * ============================ */
  const typeData = [
    {
      type: "BUILDING",
      label: "Tòa nhà",
      count: stats.buildings.stats.total ?? 0,
      fill: "var(--chart-2)",
    },
    {
      type: "AREA",
      label: "Khu vực ngoài trời",
      count: stats.areas.stats.total ?? 0,
      fill: "var(--chart-3)",
    },
  ];
  const activeIndex = typeData.findIndex((t) => t.type === activeType);

  const typeChartConfig = {
    BUILDING: { label: "Tòa nhà", color: "var(--chart-2)" },
    AREA: { label: "Khu vực ngoài trời", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  /* ============================
   * 🔹 Bar Chart: Trạng thái
   * ============================ */
  const activeStats =
    activeType === "BUILDING" ? stats.buildings : stats.areas;

  const statusData = [
    { status: "Hoạt động", count: activeStats.stats.active ?? 0 },
{ status: "Không hoạt động", count: activeStats.stats.inactive ?? 0 },
  ];

  /* ============================
   * 🔹 Bar Chart: Mới thêm
   * ============================ */
  const newData = [
    {
      label:
        activeType === "BUILDING" ? "Tòa nhà mới" : "Khu vực ngoài trời mới",
      count: activeStats.stats.newThisMonth ?? 0,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thống kê Tòa nhà & Khu vực ngoài trời</DialogTitle>
          <DialogDescription>
            Tổng quan theo loại, trạng thái và số lượng mới
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="type" className="w-full flex-1 flex flex-col">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="type">Phân loại</TabsTrigger>
            <TabsTrigger value="status">Trạng thái</TabsTrigger>
            <TabsTrigger value="new">Mới thêm</TabsTrigger>
          </TabsList>

          {/* 🟢 Tab 1: Phân loại */}
          <TabsContent value="type" className="data-[state=active]:flex flex-col">
            <Card className="border-0 shadow-none flex-1 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Phân loại</CardTitle>
                <CardDescription>
                  Tổng số tòa nhà và khu vực ngoài trời trong hệ thống
                </CardDescription>
              </CardHeader>

              <CardContent className="flex justify-center items-center flex-1">
                {loading ? (
                  <Skeleton className="h-[250px] w-[250px] rounded-full" />
                ) : (
                  <ChartContainer config={typeChartConfig}>
                    <PieChart width={300} height={300}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={typeData}
                        dataKey="count"
                        nameKey="type"
                        innerRadius={60}
                        outerRadius={110}
                        activeIndex={activeIndex >= 0 ? activeIndex : 0}
                        onClick={(_, index) =>
                          setActiveType(typeData[index].type as "BUILDING" | "AREA")
                        }
                        activeShape={({ outerRadius = 0, ...props }) => (
                          <g>
                            <Sector {...props} outerRadius={outerRadius + 10} />
                          </g>
                        )}
                      >
                        {typeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              const active = typeData[activeIndex >= 0 ? activeIndex : 0];
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    y={(viewBox.cy || 0) - 10}
                                    className="text-xs fill-muted-foreground"
                                  >
                                    {active?.label}
                                  </tspan>
                                  <tspan
                                    y={(viewBox.cy || 0) + 10}
                                    className="text-2xl font-bold fill-foreground"
                                  >
                                    {active?.count}
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                )}
              </CardContent>

              <CardFooter className="text-xs text-muted-foreground flex items-center justify-center">
                Click vào biểu đồ để chuyển loại thống kê
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 🟣 Tab 2: Trạng thái */}
          <TabsContent value="status" className="data-[state=active]:flex flex-col">
            <Card className="border-0 shadow-none flex-1 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Trạng thái {activeType === "BUILDING" ? "Tòa nhà" : "Khu vực ngoài trời"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ChartContainer config={{ count: { label: "Số lượng" } }}>
                    <BarChart data={statusData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--chart-1)" radius={8}>
                        <LabelList dataKey="count" position="top" />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex items-center justify-center">
                <Building2 className="h-4 w-4 mr-1" /> Phân bố trạng thái hoạt động
              </CardFooter>
            </Card>
          </TabsContent>

          {/* 🔵 Tab 3: Mới thêm */}
          <TabsContent value="new" className="data-[state=active]:flex flex-col">
            <Card className="border-0 shadow-none flex-1 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mới thêm trong tháng</CardTitle>
                <CardDescription>
                  Tổng số {activeType === "BUILDING" ? "tòa nhà" : "khu vực ngoài trời"} mới
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ChartContainer config={{ count: { label: "Số lượng" } }}>
                    <BarChart data={newData}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--chart-4)" radius={8}>
                        <LabelList dataKey="count" position="top" />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-1" /> Số lượng mới trong tháng
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
