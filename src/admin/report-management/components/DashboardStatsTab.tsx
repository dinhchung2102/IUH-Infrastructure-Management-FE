import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import api from "@/lib/axios";
import type { ReportStatsApiResponse } from "../api/report.api";

export function DashboardStatsTab() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<ReportStatsApiResponse | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Call the API directly to get raw stats
        const response = await api.get("/report/stats");
        if (response.data.success && response.data.data) {
          // Handle nested data structure
          const apiData = response.data.data?.data || response.data.data;
          setStats(apiData);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Không có dữ liệu
      </div>
    );
  }

  // Prepare data for charts
  const statusData = [
    {
      name: "Trạng thái",
      "Chờ xử lý": stats.reportsByStatus?.PENDING || 0,
      "Đã duyệt": stats.reportsByStatus?.APPROVED || 0,
      "Đã từ chối": stats.reportsByStatus?.REJECTED || 0,
      "Đang xử lý": stats.reportsByStatus?.IN_PROGRESS || 0,
      "Đã giải quyết": stats.reportsByStatus?.RESOLVED || 0,
      "Đã đóng": stats.reportsByStatus?.CLOSED || 0,
    },
  ];

  const typeData = [
    {
      name: "Loại báo cáo",
      "Sự cố": stats.reportsByType?.ISSUE || 0,
      "Bảo trì": stats.reportsByType?.MAINTENANCE || 0,
      "Yêu cầu": stats.reportsByType?.REQUEST || 0,
    },
  ];

  const priorityData = [
    {
      name: "Độ ưu tiên",
      "Thấp": stats.reportsByPriority?.LOW || 0,
      "Trung bình": stats.reportsByPriority?.MEDIUM || 0,
      "Cao": stats.reportsByPriority?.HIGH || 0,
      "Khẩn cấp": stats.reportsByPriority?.CRITICAL || 0,
    },
  ];

  const statusConfig = {
    "Chờ xử lý": { label: "Chờ xử lý", color: "hsl(var(--chart-1))" },
    "Đã duyệt": { label: "Đã duyệt", color: "hsl(var(--chart-2))" },
    "Đã từ chối": { label: "Đã từ chối", color: "hsl(var(--chart-3))" },
    "Đang xử lý": { label: "Đang xử lý", color: "hsl(var(--chart-4))" },
    "Đã giải quyết": { label: "Đã giải quyết", color: "hsl(var(--chart-5))" },
    "Đã đóng": { label: "Đã đóng", color: "hsl(var(--chart-1))" },
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số báo cáo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.reportsThisMonth || 0} báo cáo trong tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Báo cáo tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reportsThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.reportsLastMonth || 0} báo cáo tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Thời gian giải quyết TB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageResolutionTime?.toFixed(1) || 0} ngày
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Trung bình thời gian giải quyết
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Báo cáo theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusConfig}>
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Chờ xử lý" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã duyệt" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã từ chối" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đang xử lý" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã giải quyết" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Đã đóng" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
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
    </div>
  );
}

