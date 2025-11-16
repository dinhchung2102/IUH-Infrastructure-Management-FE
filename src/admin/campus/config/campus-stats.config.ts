import type { ChartConfig } from "@/components/ui/chart";

export const campusStatusChartConfig: ChartConfig = {
  ACTIVE: { label: "Đang hoạt động", color: "var(--chart-2)" },
  INACTIVE: { label: "Ngừng hoạt động", color: "var(--chart-3)" },
};

export const campusOverviewChartConfig: ChartConfig = {
  totalCampus: {
    label: "Số lượng",
    color: "var(--chart-1)",
  },
};
