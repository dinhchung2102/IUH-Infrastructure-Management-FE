import { useState, useEffect } from "react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
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
import type { AuditStatsApiResponse } from "../api/audit.api";

export default function AuditStatisticsPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AuditStatsApiResponse | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Call API directly to get raw AuditStatsApiResponse
        const response = await api.get<{
          success: boolean;
          data: { data: AuditStatsApiResponse } | AuditStatsApiResponse;
        }>("/audit/stats");
        if (response.data.success && response.data.data) {
          // Handle nested data structure: response.data.data.data or response.data.data
          const rawData = response.data.data;
          if (rawData && typeof rawData === 'object' && 'data' in rawData) {
            setStats((rawData as { data: AuditStatsApiResponse }).data);
          } else {
            setStats(rawData as AuditStatsApiResponse);
          }
        }
      } catch (error) {
        console.error("Error fetching audit stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Báo cáo & Thống kê", href: "/admin/reports/statistics" },
            { label: "Thống kê nhiệm vụ", isCurrent: true },
          ]}
        />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="space-y-6">
        <PageBreadcrumb
          items={[
            { label: "Dashboard", href: "/admin" },
            { label: "Báo cáo & Thống kê", href: "/admin/reports/statistics" },
            { label: "Thống kê nhiệm vụ", isCurrent: true },
          ]}
        />
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          Không có dữ liệu
        </div>
      </div>
    );
  }

  const statusData = [
    {
      name: "Trạng thái",
      "Chờ xử lý": stats.auditsByStatus?.PENDING || 0,
      "Đang xử lý": stats.auditsByStatus?.IN_PROGRESS || 0,
      "Đã hoàn thành": stats.auditsByStatus?.COMPLETED || 0,
      "Đã hủy": stats.auditsByStatus?.CANCELLED || 0,
    },
  ];

  const chartConfig = {
    "Chờ xử lý": { label: "Chờ xử lý", color: "hsl(var(--chart-1))" },
    "Đang xử lý": { label: "Đang xử lý", color: "hsl(var(--chart-2))" },
    "Đã hoàn thành": { label: "Đã hoàn thành", color: "hsl(var(--chart-3))" },
    "Đã hủy": { label: "Đã hủy", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Báo cáo & Thống kê", href: "/admin/reports/statistics" },
          { label: "Thống kê nhiệm vụ", isCurrent: true },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng số nhiệm vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAudits || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.auditsThisMonth || 0} nhiệm vụ trong tháng này
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nhiệm vụ tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.auditsThisMonth || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.auditsLastMonth || 0} nhiệm vụ tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.auditsByStatus?.COMPLETED || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalAudits > 0
                ? (
                    ((stats.auditsByStatus?.COMPLETED || 0) / stats.totalAudits) *
                    100
                  ).toFixed(1)
                : 0}
              % tổng số
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Nhiệm vụ theo trạng thái</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="Chờ xử lý" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Đang xử lý" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Đã hoàn thành" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Đã hủy" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

