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
import { Skeleton } from "@/components/ui/skeleton";
import type { AccountStatistics } from "../api/account-stats.api";
import {
  roleChartConfig,
  timeBarConfig,
  timeSeriesConfig,
} from "../config/account-stats.config";
import type { TimeType } from "../hooks";

interface AccountStatsDialogTabsProps {
  stats: AccountStatistics | null;
  loading: boolean;
  timeType: TimeType;
  setTimeType: (value: TimeType) => void;
  activeRole: string;
  setActiveRole: (role: string) => void;
}

export function AccountStatsDialogTabs({
  stats,
  loading,
  timeType,
  setTimeType,
  activeRole,
  setActiveRole,
}: AccountStatsDialogTabsProps) {
  const roleData =
    stats?.accountsByRole.map((item, index) => ({
      role: item.role,
      count: item.count,
      fill: `var(--chart-${(index % 5) + 1})`,
    })) || [];

  const activeRoleIndex = roleData.findIndex(
    (item) => item.role === activeRole
  );

  const timeBarData =
    stats?.timeSeries?.map((item) => ({
      period: item.period,
      totalAccounts: item.totalAccounts,
      fill: "var(--chart-1)",
    })) || [];

  return (
    <Tabs
      defaultValue="roles"
      className="w-full flex-1 flex flex-col overflow-hidden"
    >
      <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
        <TabsTrigger value="roles">Phân bố vai trò</TabsTrigger>
        <TabsTrigger value="timeseries">Xu hướng</TabsTrigger>
        <TabsTrigger value="status">Trạng thái</TabsTrigger>
      </TabsList>

      {/* Tab Content Container */}
      <div className="flex-1 mt-2">
        {/* Tab 1: Role Distribution - Pie Chart */}
        <TabsContent
          value="roles"
          className="m-0 data-[state=active]:flex data-[state=active]:flex-col"
        >
          <Card className="border-0 shadow-none h-full flex flex-col">
            <CardContent className="pt-4 pb-2 flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-[280px]">
                  <Skeleton className="h-[250px] w-[250px] rounded-full" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-3 h-full">
                  {/* Pie Chart - occupies 2 columns on large screens */}
                  <div className="flex justify-center col-span-1 lg:col-span-2">
                    <ChartContainer
                      config={roleChartConfig}
                      className="aspect-square w-full max-w-[300px]"
                    >
                      <PieChart width={300} height={300}>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={roleData}
                          dataKey="count"
                          nameKey="role"
                          innerRadius={50}
                          outerRadius={110}
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
                                const activeData = roleData[activeRoleIndex];
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
                  <div className="space-y-1 lg:pl-2 max-h-[280px] overflow-y-auto">
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
            <CardFooter className="flex-col items-center gap-1 text-sm border-t pt-3 bg-muted/30 flex-shrink-0">
              <div className="flex gap-2 items-center leading-none font-semibold text-sm">
                <Users className="h-4 w-4" />
                Phân bố tài khoản theo vai trò
              </div>
              <div className="text-muted-foreground leading-none text-xs text-center">
                Click vào biểu đồ hoặc chú thích để xem chi tiết từng vai trò
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Tab 2: Time Series - Line Chart */}
        <TabsContent
          value="timeseries"
          className="m-0 data-[state=active]:flex data-[state=active]:flex-col"
        >
          <Card className="border-0 shadow-none h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Xu hướng tài khoản
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Tổng số tài khoản theo thời gian
                  </CardDescription>
                </div>
                <Select
                  value={timeType}
                  onValueChange={(value) => setTimeType(value as TimeType)}
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
            <CardContent className="pb-2 flex-1">
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : stats?.timeSeries && stats.timeSeries.length > 0 ? (
                <ChartContainer
                  config={timeSeriesConfig}
                  className="w-full h-[200px]"
                >
                  <LineChart
                    data={stats.timeSeries}
                    width={800}
                    height={200}
                    margin={{
                      left: 12,
                      right: 12,
                      top: 12,
                      bottom: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value) => {
                        if (timeType === "month") return value.slice(5);
                        if (timeType === "date") return value.slice(5);
                        return value;
                      }}
                    />
                    <YAxis tick={{ fontSize: 11 }} />
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
                <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                  Không có dữ liệu time series
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-center gap-1 text-sm border-t pt-3 bg-muted/30 flex-shrink-0">
              <div className="flex gap-2 items-center leading-none font-semibold text-sm">
                <TrendingUp className="h-4 w-4" />
                Xu hướng tăng trưởng tài khoản
              </div>
              <div className="text-muted-foreground leading-none text-xs text-center">
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
        <TabsContent
          value="status"
          className="m-0 data-[state=active]:flex data-[state=active]:flex-col"
        >
          <Card className="border-0 shadow-none h-full flex flex-col">
            <CardHeader className="pb-2 flex-shrink-0">
              <CardTitle className="text-base">
                Phân bố theo thời gian
              </CardTitle>
              <CardDescription className="text-xs">
                Tổng số tài khoản: {stats?.totalAccounts.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2 flex-1">
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <ChartContainer
                  config={timeBarConfig}
                  className="w-full h-[200px]"
                >
                  <BarChart
                    data={timeBarData}
                    width={800}
                    height={200}
                    margin={{
                      top: 12,
                      left: 12,
                      right: 12,
                      bottom: 12,
                    }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="period"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tick={{ fontSize: 11 }}
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
                        offset={8}
                        className="fill-foreground"
                        fontSize={11}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
              )}
            </CardContent>
            <CardFooter className="flex-col items-center gap-1 text-sm border-t pt-3 bg-muted/30 flex-shrink-0">
              <div className="flex gap-2 items-center leading-none font-semibold text-sm">
                <Users className="h-4 w-4" />
                Phân bố tài khoản theo thời gian
              </div>
              <div className="text-muted-foreground leading-none text-xs text-center">
                Hiển thị tổng số tài khoản theo các mốc thời gian
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}
