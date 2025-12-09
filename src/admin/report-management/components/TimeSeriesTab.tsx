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
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { getReportTimeSeries } from "../api/report.api";
import type { TimeSeriesItem } from "../api/report.api";

export function TimeSeriesTab() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TimeSeriesItem[]>([]);
  const [type, setType] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getReportTimeSeries({ type });
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
        console.error("Error fetching time series:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const chartData = Array.isArray(data) ? data.map((item) => ({
    date: item.date,
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

  // Format date based on type
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (type === "daily") {
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } else if (type === "weekly") {
      // Calculate week number
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
      return `Tuần ${weekNumber}`;
    } else {
      return date.toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Xu hướng báo cáo theo thời gian</CardTitle>
          <Select value={type} onValueChange={(value: "daily" | "weekly" | "monthly") => setType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Theo ngày</SelectItem>
              <SelectItem value="weekly">Theo tuần</SelectItem>
              <SelectItem value="monthly">Theo tháng</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Tổng số"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Chờ xử lý"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Đã duyệt"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Đã giải quyết"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Đã đóng"
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              Không có dữ liệu
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

