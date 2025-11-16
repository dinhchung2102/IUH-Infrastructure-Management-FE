import type { ChartConfig } from "@/components/ui/chart";

// Config for account role pie chart
export const roleChartConfig: ChartConfig = {
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
};

// Config for time series line chart - only total accounts
export const timeSeriesConfig: ChartConfig = {
  totalAccounts: {
    label: "Tổng tài khoản",
    color: "var(--chart-1)",
  },
};

// Config for time bar chart - total accounts over time
export const timeBarConfig: ChartConfig = {
  totalAccounts: {
    label: "Tổng tài khoản",
    color: "var(--chart-1)",
  },
};
