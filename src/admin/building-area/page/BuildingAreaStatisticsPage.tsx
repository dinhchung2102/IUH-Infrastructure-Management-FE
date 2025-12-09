import { useState, useEffect, useCallback } from "react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { getBuildingStatsByCampus } from "../api/building.api";
import { getAreaStatsByCampus } from "../api/area.api";
import type { BuildingStatsByCampusResponse } from "../api/building.api";
import type { AreaStatsByCampusResponse } from "../api/area.api";

export default function BuildingAreaStatisticsPage() {

  const [buildingLoading, setBuildingLoading] = useState(false);
  const [buildingStats, setBuildingStats] = useState<BuildingStatsByCampusResponse>([]);
  const [areaLoading, setAreaLoading] = useState(false);
  const [areaStats, setAreaStats] = useState<AreaStatsByCampusResponse>([]);

  const fetchBuildingStats = useCallback(async () => {
    try {
      setBuildingLoading(true);
      const res = await getBuildingStatsByCampus();
      setBuildingStats(res);
    } catch (err) {
      console.error("Error fetching building stats:", err);
      setBuildingStats([]);
    } finally {
      setBuildingLoading(false);
    }
  }, []);

  const fetchAreaStats = useCallback(async () => {
    try {
      setAreaLoading(true);
      const res = await getAreaStatsByCampus();
      setAreaStats(res);
    } catch (err) {
      console.error("Error fetching area stats:", err);
      setAreaStats([]);
    } finally {
      setAreaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuildingStats();
    fetchAreaStats();
  }, [fetchBuildingStats, fetchAreaStats]);

  const buildingChartData = buildingStats.map((item) => ({
    name: item.campusName,
    "Hoạt động": item.active,
    "Ngừng hoạt động": item.inactive,
    "Đang bảo trì": item.underMaintenance,
  }));

  const areaChartData = areaStats.map((item) => ({
    name: item.campusName,
    "Hoạt động": item.active,
    "Ngừng hoạt động": item.inactive,
    "Đang bảo trì": item.underMaintenance,
  }));

  const buildingChartConfig = {
    "Hoạt động": { label: "Hoạt động", color: "hsl(var(--chart-1))" },
    "Ngừng hoạt động": {
      label: "Ngừng hoạt động",
      color: "hsl(var(--chart-2))",
    },
    "Đang bảo trì": { label: "Đang bảo trì", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  const areaChartConfig = {
    "Hoạt động": { label: "Hoạt động", color: "hsl(var(--chart-1))" },
    "Ngừng hoạt động": {
      label: "Ngừng hoạt động",
      color: "hsl(var(--chart-2))",
    },
    "Đang bảo trì": { label: "Đang bảo trì", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Báo cáo & Thống kê", href: "/admin/reports/statistics" },
          { label: "Thống kê Tòa nhà & Khu vực", isCurrent: true },
        ]}
      />

      <Tabs defaultValue="buildings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="buildings">Tòa nhà</TabsTrigger>
          <TabsTrigger value="areas">Khu vực ngoài trời</TabsTrigger>
        </TabsList>

        <TabsContent value="buildings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê Tòa nhà theo Cơ sở</CardTitle>
            </CardHeader>
            <CardContent>
              {buildingLoading ? (
                <Skeleton className="h-[500px] w-full" />
              ) : buildingChartData.length > 0 ? (
                <ChartContainer config={buildingChartConfig}>
                  <BarChart
                    data={buildingChartData}
                    margin={{ top: 50, right: 30, left: 20, bottom: 100 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
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
                <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                  Không có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Thống kê Khu vực ngoài trời theo Cơ sở</CardTitle>
            </CardHeader>
            <CardContent>
              {areaLoading ? (
                <Skeleton className="h-[500px] w-full" />
              ) : areaChartData.length > 0 ? (
                <ChartContainer config={areaChartConfig}>
                  <BarChart
                    data={areaChartData}
                    margin={{ top: 50, right: 30, left: 20, bottom: 100 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={120}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend wrapperStyle={{ paddingTop: "20px" }} />
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
                <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                  Không có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

