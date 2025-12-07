import type { ChartConfig } from "@/components/ui/chart";

// Professional color palette for charts - bright but not too bright, easy to differentiate
export const COLORS = [
  "#4f46e5", // Indigo (darker blue)
  "#059669", // Emerald (darker green)
  "#d97706", // Amber (darker orange)
  "#dc2626", // Red (darker)
  "#7c3aed", // Purple (darker)
  "#0891b2", // Cyan (darker)
  "#ea580c", // Orange (darker)
  "#db2777", // Pink (darker)
  "#0d9488", // Teal (darker)
  "#5b21b6", // Indigo (darker)
  "#65a30d", // Lime (darker)
  "#e11d48", // Rose (darker)
];

export const reportChartConfig = {
  count: {
    label: "Số lượng báo cáo",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
