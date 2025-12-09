import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { getReportStatisticsByLocation } from "../api/report.api";
import type { LocationStatisticsItem } from "../api/report.api";

export function LocationStatsTab() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LocationStatisticsItem[]>([]);
  const [groupBy, setGroupBy] = useState<"campus" | "building" | "area" | "zone">("campus");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getReportStatisticsByLocation({ groupBy });
        if (response.success && response.data) {
          // Handle nested data structure if needed
          const responseData = Array.isArray(response.data) 
            ? response.data 
            : (response.data as any)?.data || [];
          setData(Array.isArray(responseData) ? responseData : []);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching location stats:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupBy]);

  const chartData = Array.isArray(data) && data.length > 0 
    ? data.slice(0, 10).map((item) => ({
    name: item.locationName.length > 15 ? item.locationName.substring(0, 15) + "..." : item.locationName,
    fullName: item.locationName,
    "Tổng số": item.total,
    "Chờ xử lý": item.byStatus?.PENDING || 0,
    "Đã duyệt": item.byStatus?.APPROVED || 0,
    "Đã giải quyết": item.byStatus?.RESOLVED || 0,
    "Đã đóng": item.byStatus?.CLOSED || 0,
  })) : [];

  const chartConfig = {
    "Tổng số": { label: "Tổng số", color: "hsl(var(--chart-1))" },
    "Chờ xử lý": { label: "Chờ xử lý", color: "hsl(var(--chart-2))" },
    "Đã duyệt": { label: "Đã duyệt", color: "hsl(var(--chart-3))" },
    "Đã giải quyết": { label: "Đã giải quyết", color: "hsl(var(--chart-4))" },
    "Đã đóng": { label: "Đã đóng", color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thống kê theo vị trí</CardTitle>
          <Select
            value={groupBy}
            onValueChange={(value: "campus" | "building" | "area" | "zone") => setGroupBy(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="campus">Theo cơ sở</SelectItem>
              <SelectItem value="building">Theo tòa nhà</SelectItem>
              <SelectItem value="area">Theo khu vực ngoài trời</SelectItem>
              <SelectItem value="zone">Theo phòng - khu vực</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[500px] w-full" />
          ) : chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
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
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value: number, name: string) => [value, name]}
                  labelFormatter={(label) => {
                    const item = chartData.find((d) => d.name === label);
                    return item?.fullName || label;
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Bar dataKey="Tổng số" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Chờ xử lý" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã duyệt" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã giải quyết" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã đóng" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

