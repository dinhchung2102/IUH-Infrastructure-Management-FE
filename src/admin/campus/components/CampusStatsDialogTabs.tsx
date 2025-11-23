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
  PieChart,
  Pie,
  Label,
  Sector,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, TrendingUp } from "lucide-react";
import {
  campusOverviewChartConfig,
  campusStatusChartConfig,
} from "../config/campus-stats.config";

interface CampusStatsDialogTabsProps {
  loading: boolean;
  activeStatus: "ACTIVE" | "INACTIVE";
  setActiveStatus: (status: "ACTIVE" | "INACTIVE") => void;
  statusData: Array<{ status: string; count: number; fill: string }>;
  activeStatusIndex: number;
  timeData: Array<{ period: string; totalCampus: number }>;
}

export function CampusStatsDialogTabs({
  loading,
  activeStatus,
  setActiveStatus,
  statusData,
  activeStatusIndex,
  timeData,
}: CampusStatsDialogTabsProps) {
  return (
    <Tabs defaultValue="status" className="w-full flex-1 flex flex-col">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="status">Phân bố trạng thái</TabsTrigger>
        <TabsTrigger value="timeseries">Tổng quan</TabsTrigger>
      </TabsList>

      {/* Status tab */}
      <TabsContent
        value="status"
        className="m-0 data-[state=active]:flex data-[state=active]:flex-col"
      >
        <Card className="border-0 shadow-none h-full flex flex-col">
          <CardContent className="pt-4 pb-2 flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-[280px]">
                <Skeleton className="h-[250px] w-[250px] rounded-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-3 h-full">
                {/* Pie chart */}
                <div className="flex justify-center col-span-2">
                  <ChartContainer
                    config={campusStatusChartConfig}
                    className="aspect-square w-full max-w-[300px]"
                  >
                    <PieChart width={300} height={300}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={50}
                        outerRadius={110}
                        strokeWidth={5}
                        activeIndex={activeStatusIndex}
                        activeShape={({ outerRadius = 0, ...props }) => (
                          <g>
                            <Sector {...props} outerRadius={outerRadius + 12} />
                            <Sector
                              {...props}
                              outerRadius={outerRadius + 24}
                              innerRadius={outerRadius + 12}
                            />
                          </g>
                        )}
                        onClick={(data) => {
                          if (data && data.status) {
                            setActiveStatus(
                              data.status as "ACTIVE" | "INACTIVE"
                            );
                          }
                        }}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              const activeData =
                                statusData[activeStatusIndex] || null;
                              const statusLabel =
                                campusStatusChartConfig[
                                  activeData?.status as keyof typeof campusStatusChartConfig
                                ]?.label || activeData?.status;
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
                                    {statusLabel}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 20}
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {activeData?.count ?? 0}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 36}
                                    className="fill-muted-foreground text-xs"
                                  >
                                    Cơ sở
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

                {/* Legend */}
                <div className="space-y-1 max-h-[280px] overflow-y-auto">
                  {statusData.map((item) => (
                    <button
                      key={item.status}
                      onClick={() =>
                        setActiveStatus(item.status as "ACTIVE" | "INACTIVE")
                      }
                      className={`flex items-center gap-2 p-2 rounded-lg transition-colors w-full ${
                        activeStatus === item.status
                          ? "bg-accent"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span className="text-xs font-medium flex-1 text-left">
                        {
                          campusStatusChartConfig[
                            item.status as keyof typeof campusStatusChartConfig
                          ]?.label
                        }
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
          <CardFooter className="flex-col items-center gap-1 text-sm border-t pt-3 bg-muted/30">
            <div className="flex gap-2 items-center font-semibold text-sm">
              <Building2 className="h-4 w-4" />
              Phân bố trạng thái cơ sở
            </div>
            <div className="text-muted-foreground text-xs text-center">
              Click vào biểu đồ hoặc chú thích để xem chi tiết
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Overview tab */}
      <TabsContent
        value="timeseries"
        className="m-0 data-[state=active]:flex data-[state=active]:flex-col"
      >
        <Card className="border-0 shadow-none h-full flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tổng quan cơ sở</CardTitle>
            <CardDescription className="text-xs">
              Số lượng cơ sở hiện tại và theo trạng thái
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2 flex-1">
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <ChartContainer
                config={campusOverviewChartConfig}
                className="w-full h-[200px]"
              >
                <BarChart
                  data={timeData}
                  width={800}
                  height={200}
                  margin={{ top: 12, left: 12, right: 12, bottom: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="totalCampus"
                    fill="var(--color-totalCampus)"
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
          <CardFooter className="flex-col items-center gap-1 text-sm border-t pt-3 bg-muted/30">
            <div className="flex gap-2 items-center font-semibold text-sm">
              <TrendingUp className="h-4 w-4" />
              Tổng quan cơ sở
            </div>
            <div className="text-muted-foreground text-xs text-center">
              Hiển thị tổng số cơ sở và phân loại theo trạng thái
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
