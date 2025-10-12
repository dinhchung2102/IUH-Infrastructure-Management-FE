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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Label, Pie, PieChart, Sector } from "recharts";
import { Line, LineChart } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, Users } from "lucide-react";
import { getAccountStats } from "../api/account-stats.api";
import type { AccountStatistics } from "../api/account-stats.api";
import { Skeleton } from "@/components/ui/skeleton";

interface AccountStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountStatsDialog({
  open,
  onOpenChange,
}: AccountStatsDialogProps) {
  const [stats, setStats] = useState<AccountStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeType, setTimeType] = useState<
    "month" | "date" | "quarter" | "year"
  >("month");
  const [activeRole, setActiveRole] = useState("");

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAccountStats({ type: timeType });
      setStats(response.data || null);
      if (response.data?.accountsByRole) {
        setActiveRole(response.data.accountsByRole[0].role);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }, [timeType]);

  useEffect(() => {
    if (open) {
      fetchStats();
    }
  }, [open, fetchStats]);

  // Pie chart config for roles
  const roleChartConfig = {
    count: {
      label: "Số lượng",
    },
    ADMIN: {
      label: "Quản trị viên",
      color: "var(--chart-1)",
    },
    CAMPUS_ADMIN: {
      label: "Quản trị cơ sở",
      color: "var(--chart-2)",
    },
    STAFF: {
      label: "Nhân viên",
      color: "var(--chart-3)",
    },
    LECTURER: {
      label: "Giảng viên",
      color: "var(--chart-4)",
    },
    STUDENT: {
      label: "Sinh viên",
      color: "var(--chart-5)",
    },
    GUEST: {
      label: "Khách",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const roleData =
    stats?.accountsByRole.map((item, index) => ({
      role: item.role,
      count: item.count,
      fill: `var(--chart-${(index % 5) + 1})`,
    })) || [];

  const activeRoleIndex = roleData.findIndex(
    (item) => item.role === activeRole
  );

  // Line chart config for time series - chỉ hiển thị tổng tài khoản
  const timeSeriesConfig = {
    totalAccounts: {
      label: "Tổng tài khoản",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // Bar chart config - hiển thị tổng tài khoản theo thời gian
  const timeBarConfig = {
    totalAccounts: {
      label: "Tổng tài khoản",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  // Chuyển timeSeries thành dữ liệu cho bar chart
  const timeBarData =
    stats?.timeSeries?.map((item) => ({
      period: item.period,
      totalAccounts: item.totalAccounts,
      fill: "var(--chart-1)",
    })) || [];

  // --- Widen the dialog (was w-[90vw], set to w-[1200px] max-w-[98vw]) ---
  // Remove any width constraints inside children if possible.
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] !max-w-[800px] overflow-y-auto ">
        <DialogHeader>
          <DialogTitle>Thống kê tài khoản</DialogTitle>
          <DialogDescription>
            Xem các biểu đồ và phân tích chi tiết về tài khoản trong hệ thống
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="roles" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="roles">Phân bố vai trò</TabsTrigger>
            <TabsTrigger value="timeseries">Xu hướng</TabsTrigger>
            <TabsTrigger value="status">Trạng thái</TabsTrigger>
          </TabsList>

          {/* Layout ngang với 2 cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Tab 1: Role Distribution - Pie Chart */}
            <TabsContent
              value="roles"
              className="col-span-1 lg:col-span-2 bg-amber-500"
            >
              <Card>
                <CardContent className="pb-2">
                  {loading ? (
                    <div className="flex items-center justify-center h-[400px]">
                      <Skeleton className="h-[400px] w-[400px] rounded-full" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6">
                      {/* Pie Chart - occupies 2 columns on large screens */}
                      <div className="flex justify-center col-span-1 lg:col-span-2">
                        <ChartContainer
                          config={roleChartConfig}
                          className="aspect-square w-full max-w-[500px]"
                        >
                          <PieChart width={450} height={450}>
                            <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                              data={roleData}
                              dataKey="count"
                              nameKey="role"
                              innerRadius={80}
                              outerRadius={170}
                              strokeWidth={5}
                              activeIndex={activeRoleIndex}
                              activeShape={({
                                outerRadius = 0,
                                ...props
                              }: PieSectorDataItem) => (
                                <g>
                                  <Sector
                                    {...props}
                                    outerRadius={outerRadius + 12}
                                  />
                                  <Sector
                                    {...props}
                                    outerRadius={outerRadius + 24}
                                    innerRadius={outerRadius + 12}
                                  />
                                </g>
                              )}
                              onClick={(data) => {
                                if (data && data.role) {
                                  setActiveRole(data.role);
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              <Label
                                content={({ viewBox }) => {
                                  if (
                                    viewBox &&
                                    "cx" in viewBox &&
                                    "cy" in viewBox
                                  ) {
                                    const activeData =
                                      roleData[activeRoleIndex];
                                    const roleLabel =
                                      roleChartConfig[
                                        activeData?.role as keyof typeof roleChartConfig
                                      ]?.label || activeData?.role;
                                    return (
                                      <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                      >
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) - 12}
                                          className="fill-muted-foreground text-xs"
                                        >
                                          {roleLabel}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 20}
                                          className="fill-foreground text-2xl font-bold"
                                        >
                                          {activeData?.count.toLocaleString()}
                                        </tspan>
                                        <tspan
                                          x={viewBox.cx}
                                          y={(viewBox.cy || 0) + 36}
                                          className="fill-muted-foreground text-xs"
                                        >
                                          Tài khoản
                                        </tspan>
                                      </text>
                                    );
                                  }
                                }}
                              />
                            </Pie>
                          </PieChart>
                        </ChartContainer>
                      </div>

                      {/* Legend - occupies 1 column on large screens */}
                      <div className="space-y-1 lg:pl-2">
                        {roleData.map((item) => (
                          <button
                            key={item.role}
                            onClick={() => setActiveRole(item.role)}
                            className={`flex items-center gap-2 p-2 rounded-lg transition-colors w-full ${
                              activeRole === item.role
                                ? "bg-accent"
                                : "hover:bg-accent/50"
                            }`}
                          >
                            <span
                              className="h-3 w-3 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="text-xs font-medium text-left flex-1">
                              {roleChartConfig[
                                item.role as keyof typeof roleChartConfig
                              ]?.label || item.role}
                            </span>
                            <span className="text-xs text-muted-foreground font-bold bg-muted px-1.5 py-0.5 rounded">
                              {item.count}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 leading-none font-medium">
                    <Users className="h-4 w-4" />
                    Phân bố tài khoản theo vai trò
                  </div>
                  <div className="text-muted-foreground leading-none">
                    Click vào biểu đồ hoặc chú thích để xem chi tiết từng vai
                    trò
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tab 2: Time Series - Line Chart */}
            <TabsContent
              value="timeseries"
              className="col-span-1 lg:col-span-2"
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Xu hướng tài khoản</CardTitle>
                      <CardDescription>
                        Tổng số tài khoản theo thời gian
                      </CardDescription>
                    </div>
                    <Select
                      value={timeType}
                      onValueChange={(value) =>
                        setTimeType(
                          value as "month" | "date" | "quarter" | "year"
                        )
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Theo ngày</SelectItem>
                        <SelectItem value="month">Theo tháng</SelectItem>
                        <SelectItem value="quarter">Theo quý</SelectItem>
                        <SelectItem value="year">Theo năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : stats?.timeSeries && stats.timeSeries.length > 0 ? (
                    <ChartContainer
                      config={timeSeriesConfig}
                      className="w-full max-w-full"
                    >
                      <LineChart
                        data={stats.timeSeries}
                        width={700}
                        height={350}
                        margin={{
                          left: 24,
                          right: 24,
                          top: 24,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="period"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickFormatter={(value) => {
                            if (timeType === "month") return value.slice(5);
                            if (timeType === "date") return value.slice(5);
                            return value;
                          }}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          dataKey="totalAccounts"
                          type="monotone"
                          stroke="var(--color-totalAccounts)"
                          strokeWidth={3}
                          dot={{
                            fill: "var(--color-totalAccounts)",
                            strokeWidth: 2,
                            r: 4,
                          }}
                        />
                      </LineChart>
                    </ChartContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                      Không có dữ liệu time series
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 leading-none font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Xu hướng tăng trưởng tài khoản
                  </div>
                  <div className="text-muted-foreground leading-none">
                    Hiển thị số lượng tài khoản mới theo{" "}
                    {timeType === "date"
                      ? "ngày"
                      : timeType === "month"
                      ? "tháng"
                      : timeType === "quarter"
                      ? "quý"
                      : "năm"}
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Tab 3: Status Distribution - Bar Chart */}
            <TabsContent value="status" className="col-span-1 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố theo thời gian</CardTitle>
                  <CardDescription>
                    Tổng số tài khoản: {stats?.totalAccounts.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Skeleton className="h-[350px] w-full" />
                  ) : (
                    <ChartContainer
                      config={timeBarConfig}
                      className="w-full max-w-full"
                    >
                      <BarChart
                        data={timeBarData}
                        width={700}
                        height={350}
                        margin={{
                          top: 20,
                          left: 20,
                          right: 20,
                        }}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="period"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                          dataKey="totalAccounts"
                          fill="var(--color-totalAccounts)"
                          radius={8}
                        >
                          <LabelList
                            position="top"
                            offset={12}
                            className="fill-foreground"
                            fontSize={12}
                          />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 leading-none font-medium">
                    <Users className="h-4 w-4" />
                    Phân bố tài khoản theo thời gian
                  </div>
                  <div className="text-muted-foreground leading-none">
                    Hiển thị tổng số tài khoản theo các mốc thời gian
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
