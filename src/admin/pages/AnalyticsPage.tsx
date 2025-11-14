import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
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
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

// Fake data for analytics
const reportStatsData = [
  { month: "Tháng 1", total: 45, approved: 38, pending: 7 },
  { month: "Tháng 2", total: 52, approved: 45, pending: 7 },
  { month: "Tháng 3", total: 48, approved: 42, pending: 6 },
  { month: "Tháng 4", total: 61, approved: 55, pending: 6 },
  { month: "Tháng 5", total: 55, approved: 48, pending: 7 },
  { month: "Tháng 6", total: 67, approved: 60, pending: 7 },
];

const assetStatusData = [
  { name: "Đang sử dụng", value: 120, color: "var(--chart-2)" },
  { name: "Bảo trì", value: 15, color: "var(--chart-3)" },
  { name: "Hư hỏng", value: 8, color: "var(--chart-1)" },
  { name: "Ngừng sử dụng", value: 5, color: "var(--chart-4)" },
];

const userActivityData = [
  { day: "T2", active: 120, new: 5 },
  { day: "T3", active: 135, new: 8 },
  { day: "T4", active: 142, new: 6 },
  { day: "T5", active: 128, new: 7 },
  { day: "T6", active: 150, new: 10 },
  { day: "T7", active: 95, new: 3 },
  { day: "CN", active: 80, new: 2 },
];

const reportTypeData = [
  { type: "Hư hỏng", count: 45, color: "var(--chart-1)" },
  { type: "Mất mát", count: 28, color: "var(--chart-2)" },
  { type: "Bảo trì", count: 35, color: "var(--chart-3)" },
  { type: "Khác", count: 12, color: "var(--chart-4)" },
];

const campusDistributionData = [
  { campus: "Phạm Văn Chiêu", assets: 85, reports: 42 },
  { campus: "Cơ sở 2", assets: 52, reports: 28 },
  { campus: "Cơ sở 3", assets: 31, reports: 15 },
];

const reportChartConfig = {
  total: {
    label: "Tổng báo cáo",
    color: "hsl(var(--chart-1))",
  },
  approved: {
    label: "Đã duyệt",
    color: "hsl(var(--chart-2))",
  },
  pending: {
    label: "Chờ xử lý",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const userChartConfig = {
  active: {
    label: "Người dùng hoạt động",
    color: "hsl(var(--chart-1))",
  },
  new: {
    label: "Người dùng mới",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">(
    "month"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thống kê</h1>
          <p className="text-muted-foreground">
            Phân tích và thống kê tổng quan về hệ thống
          </p>
        </div>
        <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Theo tháng</SelectItem>
            <SelectItem value="quarter">Theo quý</SelectItem>
            <SelectItem value="year">Theo năm</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng báo cáo</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600" /> +12% so
              với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tài sản</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">148</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600" /> +5% so
              với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Người dùng hoạt động
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">852</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600" /> +8% so
              với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ xử lý</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.5%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-600" /> +2.3% so
              với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="assets">Tài sản</TabsTrigger>
          <TabsTrigger value="users">Người dùng</TabsTrigger>
          <TabsTrigger value="distribution">Phân bố</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo theo tháng</CardTitle>
                <CardDescription>
                  Xu hướng báo cáo trong 6 tháng gần đây
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={reportChartConfig}>
                  <BarChart data={reportStatsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="var(--color-total)" />
                    <Bar dataKey="approved" fill="var(--color-approved)" />
                    <Bar dataKey="pending" fill="var(--color-pending)" />
                  </BarChart>
                </ChartContainer>
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
                <ChartContainer
                  config={{
                    count: { label: "Số lượng" },
                  }}
                  className="h-[300px]"
                >
                  <PieChart>
                    <Pie
                      data={reportTypeData}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {reportTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Assets Tab */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trạng thái tài sản</CardTitle>
              <CardDescription>
                Phân bố tài sản theo trạng thái hiện tại
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Số lượng" },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={assetStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {assetStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động người dùng</CardTitle>
              <CardDescription>
                Số lượng người dùng hoạt động và mới trong tuần
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={userChartConfig}>
                <LineChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="active"
                    stroke="var(--color-active)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="new"
                    stroke="var(--color-new)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo cơ sở</CardTitle>
              <CardDescription>
                Số lượng tài sản và báo cáo theo từng cơ sở
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  assets: { label: "Tài sản", color: "hsl(var(--chart-1))" },
                  reports: {
                    label: "Báo cáo",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <BarChart data={campusDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campus" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="assets" fill="var(--color-assets)" />
                  <Bar dataKey="reports" fill="var(--color-reports)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
