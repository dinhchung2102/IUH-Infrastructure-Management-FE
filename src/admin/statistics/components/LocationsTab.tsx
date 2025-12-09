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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Loader2 } from "lucide-react";
import type { ReportsByLocationData } from "../api/statistics.api";

interface LocationsTabProps {
  reportsByLocation: ReportsByLocationData | null;
  locationType: "area" | "building" | "zone";
  onLocationTypeChange: (type: "area" | "building" | "zone") => void;
  loading: boolean;
}

export function LocationsTab({
  reportsByLocation,
  locationType,
  onLocationTypeChange,
  loading,
}: LocationsTabProps) {
  // Format reports by location data
  const reportsByLocationChartData = useMemo(() => {
    if (
      !reportsByLocation?.chartData ||
      !Array.isArray(reportsByLocation.chartData)
    )
      return [];
    return reportsByLocation.chartData.map((item) => ({
      location: item.location,
      count: item.count,
    }));
  }, [reportsByLocation]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Khu vực có nhiều báo cáo sự cố</CardTitle>
            <CardDescription>
              Top 10 khu vực có nhiều báo cáo nhất
            </CardDescription>
          </div>
          <Select value={locationType} onValueChange={onLocationTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zone">Khu vực</SelectItem>
              <SelectItem value="area">Khu vực ngoài trời</SelectItem>
              <SelectItem value="building">Tòa nhà</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : reportsByLocationChartData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Không có dữ liệu
          </div>
        ) : (
          <ChartContainer
            config={{
              count: { label: "Số lượng", color: "hsl(var(--chart-1))" },
            }}
          >
            <BarChart data={reportsByLocationChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="location" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
