"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

interface BuildingAreaStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BuildingAreaStatsDialog({
  open,
  onOpenChange,
}: BuildingAreaStatsDialogProps) {
  // ✅ Giữ UI, mặc định tất cả đều = 0
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalAreas: 0,
    activeCount: 0,
    maintenanceCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState<string>("BUILDING");

  useEffect(() => {
    if (open) {
      // Không gọi API — chỉ hiển thị dữ liệu mặc định
      setLoading(false);
    }
  }, [open]);

  const chartConfig = {
    BUILDING: { label: "Tòa nhà", color: "var(--chart-2)" },
    AREA: { label: "Khu vực", color: "var(--chart-3)" },
  } satisfies ChartConfig;

  const typeData = [
    { type: "BUILDING", count: stats.totalBuildings, fill: "var(--chart-2)" },
    { type: "AREA", count: stats.totalAreas, fill: "var(--chart-3)" },
  ];

  const activeIndex = typeData.findIndex((t) => t.type === activeType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thống kê Tòa nhà & Khu vực</DialogTitle>
          <DialogDescription>
            Xem biểu đồ tổng quan theo loại và trạng thái
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="type" className="w-full flex-1 flex flex-col">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="type">Phân loại</TabsTrigger>
            <TabsTrigger value="status">Theo trạng thái</TabsTrigger>
          </TabsList>

          {/* 🟢 Tab 1: Phân loại BUILDING / AREA */}
          <TabsContent
            value="type"
            className="data-[state=active]:flex flex-col"
          >
            <Card className="border-0 shadow-none flex-1 flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Phân loại</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center flex-1">
                {loading ? (
                  <Skeleton className="h-[250px] w-[250px] rounded-full" />
                ) : (
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-square w-full max-w-[300px]"
                  >
                    <PieChart width={300} height={300}>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie
                        data={typeData}
                        dataKey="count"
                        nameKey="type"
                        innerRadius={60}
                        outerRadius={110}
                        activeIndex={activeIndex}
                        activeShape={({ outerRadius = 0, ...props }) => (
                          <g>
                            <Sector {...props} outerRadius={outerRadius + 10} />
                          </g>
                        )}
                        onClick={(d) => setActiveType(d.type)}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              const active = typeData[activeIndex];
                              const label =
                                chartConfig[
                                  active?.type as keyof typeof chartConfig
                                ]?.label;
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
                                    {label}
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
            </Card>
          </TabsContent>

          {/* 🟣 Tab 2: Theo trạng thái */}
          <TabsContent value="status" className="data-[state=active]:flex flex-col">
            <Card className="border-0 shadow-none flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-base">Theo trạng thái</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[200px] w-full" />
                ) : (
                  <ChartContainer
                    config={{
                      total: { label: "Số lượng", color: "var(--chart-1)" },
                    }}
                  >
                    <BarChart
                      data={[
                        { status: "Hoạt động", total: stats.activeCount },
                        { status: "Bảo trì", total: stats.maintenanceCount },
                      ]}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="total" fill="var(--chart-1)" radius={8}>
                        <LabelList dataKey="total" position="top" />
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
