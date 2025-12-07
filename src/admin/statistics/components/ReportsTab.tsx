import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";
import type {
  ReportsByPeriodData,
  ReportsByTypeData,
} from "../api/statistics.api";
import { reportChartConfig, COLORS } from "../constants/chart.constants";
import type { ReportTypeChartEntry } from "../types/chart.types";

interface ReportsTabProps {
  period: "week" | "month" | "year";
  reportsByPeriod: ReportsByPeriodData | null;
  reportsByType: ReportsByTypeData | null;
  loading: {
    reportsByPeriod: boolean;
    reportsByType: boolean;
  };
}

export function ReportsTab({
  period,
  reportsByPeriod,
  reportsByType,
  loading,
}: ReportsTabProps) {
  // Format period data for chart
  const reportPeriodChartData = useMemo(() => {
    if (
      !reportsByPeriod?.chartData ||
      !Array.isArray(reportsByPeriod.chartData)
    )
      return [];
    return reportsByPeriod.chartData.map((item) => ({
      period: item.period,
      count: item.count,
    }));
  }, [reportsByPeriod]);

  // Format report type data for pie chart
  const reportTypeChartData = useMemo(() => {
    if (!reportsByType?.chartData || !Array.isArray(reportsByType.chartData))
      return [];
    return reportsByType.chartData.map((item, index) => ({
      type: item.label,
      count: item.count,
      percentage: item.percentage,
      color: COLORS[index % COLORS.length],
    }));
  }, [reportsByType]);

  const periodLabel =
    period === "week" ? "tuần" : period === "month" ? "tháng" : "năm";

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo theo thời gian</CardTitle>
          <CardDescription>
            Số lượng báo cáo theo {periodLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading.reportsByPeriod ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : reportPeriodChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <ChartContainer config={reportChartConfig}>
              <BarChart data={reportPeriodChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loại báo cáo</CardTitle>
          <CardDescription>
            Phân bố các loại báo cáo trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading.reportsByType ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : reportTypeChartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <div className="space-y-4">
              <ChartContainer
                config={{
                  count: { label: "Số lượng" },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={reportTypeChartData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry: ReportTypeChartEntry) =>
                      `${entry.type}: ${entry.count} (${entry.percentage.toFixed(1)}%)`
                    }
                  >
                    {reportTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {reportTypeChartData.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="h-4 w-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">
                      {entry.type}: {entry.count} ({entry.percentage.toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

