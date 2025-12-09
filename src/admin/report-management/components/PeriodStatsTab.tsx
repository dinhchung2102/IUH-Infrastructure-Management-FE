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
import { getReportStatisticsByPeriod } from "../api/report.api";
import type { PeriodStatisticsResponse } from "../api/report.api";

export function PeriodStatsTab() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PeriodStatisticsResponse | null>(null);
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getReportStatisticsByPeriod({ period });
        if (response.success && response.data) {
          // response.data is already PeriodStatisticsResponse
          setData(response.data);
        } else {
          setData(null);
        }
      } catch (error) {
        console.error("Error fetching period stats:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!data || !data.reports) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Không có dữ liệu
      </div>
    );
  }

  const reportsData = [
    {
      name: "Báo cáo",
      "Chờ xử lý": data.reports?.byStatus?.PENDING || 0,
      "Đã duyệt": data.reports?.byStatus?.APPROVED || 0,
      "Đã từ chối": data.reports?.byStatus?.REJECTED || 0,
      "Đã giải quyết": data.reports?.byStatus?.RESOLVED || 0,
      "Đã đóng": data.reports?.byStatus?.CLOSED || 0,
    },
  ];

  const typeData = [
    {
      name: "Loại",
      "Sự cố": data.reports?.byType?.ISSUE || 0,
      "Bảo trì": data.reports?.byType?.MAINTENANCE || 0,
      "Yêu cầu": data.reports?.byType?.REQUEST || 0,
    },
  ];

  const priorityData = [
    {
      name: "Độ ưu tiên",
      "Thấp": data.reports?.byPriority?.LOW || 0,
      "Trung bình": data.reports?.byPriority?.MEDIUM || 0,
      "Cao": data.reports?.byPriority?.HIGH || 0,
      "Khẩn cấp": data.reports?.byPriority?.CRITICAL || 0,
    },
  ];

  const auditsData = [
    {
      name: "Audit",
      "Chờ xử lý": data.audits?.byStatus?.PENDING || 0,
      "Đã hoàn thành": data.audits?.byStatus?.COMPLETED || 0,
      "Quá hạn": data.audits?.byStatus?.OVERDUE || 0,
    },
  ];

  const reportsConfig = {
    "Chờ xử lý": { label: "Chờ xử lý", color: "hsl(var(--chart-1))" },
    "Đã duyệt": { label: "Đã duyệt", color: "hsl(var(--chart-2))" },
    "Đã từ chối": { label: "Đã từ chối", color: "hsl(var(--chart-3))" },
    "Đã giải quyết": { label: "Đã giải quyết", color: "hsl(var(--chart-4))" },
    "Đã đóng": { label: "Đã đóng", color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

  const typeConfig = {
    "Sự cố": { label: "Sự cố", color: "hsl(var(--chart-1))" },
    "Bảo trì": { label: "Bảo trì", color: "hsl(var(--chart-2))" },
    "Yêu cầu": { label: "Yêu cầu", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  const priorityConfig = {
    "Thấp": { label: "Thấp", color: "hsl(var(--chart-1))" },
    "Trung bình": { label: "Trung bình", color: "hsl(var(--chart-2))" },
    "Cao": { label: "Cao", color: "hsl(var(--chart-3))" },
    "Khẩn cấp": { label: "Khẩn cấp", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  const auditsConfig = {
    "Chờ xử lý": { label: "Chờ xử lý", color: "hsl(var(--chart-1))" },
    "Đã hoàn thành": { label: "Đã hoàn thành", color: "hsl(var(--chart-2))" },
    "Quá hạn": { label: "Quá hạn", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig;

  const periodLabels = {
    month: "Tháng",
    quarter: "Quý",
    year: "Năm",
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Thống kê theo khoảng thời gian</CardTitle>
          <Select
            value={period}
            onValueChange={(value: "month" | "quarter" | "year") => setPeriod(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Theo tháng</SelectItem>
              <SelectItem value="quarter">Theo quý</SelectItem>
              <SelectItem value="year">Theo năm</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Khoảng thời gian</p>
              <p className="text-lg font-semibold">{periodLabels[period]}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Từ ngày</p>
              <p className="text-lg font-semibold">
                {new Date(data.startDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Đến ngày</p>
              <p className="text-lg font-semibold">
                {new Date(data.endDate).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Báo cáo theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tổng số</p>
                  <p className="text-2xl font-bold">{data.reports?.total || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Đã giải quyết</p>
                  <p className="text-2xl font-bold">{data.reports?.resolved || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chờ xử lý</p>
                  <p className="text-2xl font-bold">{data.reports?.pending || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Đang xử lý</p>
                  <p className="text-2xl font-bold">{data.reports?.inProgress || 0}</p>
                </div>
              </div>
              <ChartContainer config={reportsConfig}>
                <BarChart data={reportsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="Chờ xử lý" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Đã duyệt" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Đã từ chối" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Đã giải quyết" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Đã đóng" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo theo loại</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={typeConfig}>
              <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Sự cố" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Bảo trì" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Yêu cầu" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Báo cáo theo độ ưu tiên</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={priorityConfig}>
              <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Thấp" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Trung bình" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cao" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Khẩn cấp" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Tổng số</p>
                  <p className="text-2xl font-bold">{data.audits?.total || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Đã hoàn thành</p>
                  <p className="text-2xl font-bold">{data.audits?.completed || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chờ xử lý</p>
                  <p className="text-2xl font-bold">{data.audits?.pending || 0}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quá hạn</p>
                  <p className="text-2xl font-bold">{data.audits?.overdue || 0}</p>
                </div>
              </div>
              <ChartContainer config={auditsConfig}>
                <BarChart data={auditsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="Chờ xử lý" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Đã hoàn thành" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Quá hạn" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉ số hiệu suất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Thời gian giải quyết TB</p>
              <p className="text-2xl font-bold">
                {data.performance?.averageResolutionTime?.toFixed(1) || "0.0"} giờ
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Thời gian xử lý TB</p>
              <p className="text-2xl font-bold">
                {data.performance?.averageProcessingTime?.toFixed(1) || "0.0"} ngày
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tỷ lệ giải quyết</p>
              <p className="text-2xl font-bold">
                {data.performance?.resolutionRate?.toFixed(1) || "0.0"}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

