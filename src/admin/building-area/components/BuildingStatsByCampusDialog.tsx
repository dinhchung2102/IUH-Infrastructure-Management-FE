"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { getBuildingStatsByCampus } from "@/admin/building-area/api/building.api";
import type { BuildingStatsByCampusResponse } from "@/admin/building-area/api/building.api";

interface BuildingStatsByCampusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campuses?: any[]; // Not needed anymore but keeping for compatibility
}

export function BuildingStatsByCampusDialog({
  open,
  onOpenChange,
}: BuildingStatsByCampusDialogProps) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<BuildingStatsByCampusResponse>([]);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getBuildingStatsByCampus();
      setStats(res);
    } catch (err) {
      console.error("❌ Error fetching building stats by campus:", err);
      setStats([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchStats();
    }
  }, [open, fetchStats]);

  // Transform data for grouped bar chart
  const chartData = stats.map((item) => ({
    name: item.campusName,
    "Hoạt động": item.active,
    "Ngừng hoạt động": item.inactive,
    "Đang bảo trì": item.underMaintenance,
  }));

  const totalBuildings = stats.reduce((sum, item) => sum + item.total, 0);

  const chartConfig = {
    "Hoạt động": { label: "Hoạt động", color: "hsl(var(--chart-1))" },
    "Ngừng hoạt động": {
      label: "Ngừng hoạt động",
      color: "hsl(var(--chart-2))",
    },
    "Đang bảo trì": { label: "Đang bảo trì", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Thống kê Tòa nhà theo Cơ sở</DialogTitle>
          <DialogDescription>
            Xem thống kê số lượng tòa nhà theo trạng thái của tất cả các cơ sở
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col">
          {/* Chart Card */}
          <Card className="border-0 shadow-none flex-1 flex flex-col">
            <CardContent className="flex-1 min-h-[400px]">
              {loading ? (
                <Skeleton className="w-full" />
              ) : chartData.length > 0 ? (
                <ChartContainer config={chartConfig}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ paddingTop: "30px" }} />
                    <Bar
                      dataKey="Hoạt động"
                      fill="var(--chart-1)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Ngừng hoạt động"
                      fill="var(--chart-2)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="Đang bảo trì"
                      fill="var(--chart-3)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  Không có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
