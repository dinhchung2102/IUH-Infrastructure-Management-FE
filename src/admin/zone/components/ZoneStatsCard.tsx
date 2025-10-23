"use client";

import { useEffect, useState } from "react";
import { getZoneStats } from "../api/zone.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid, CheckCircle2, XCircle, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ZoneStats {
  totalZones: number;
  activeZones: number;
  inactiveZones: number;
  newZonesThisMonth: number;
}

interface ZoneStatsCardsProps {
  stats?: any;
  onRefresh?: () => Promise<void>;
  loading?: boolean;
}

export function ZoneStatsCards(_props: ZoneStatsCardsProps = {}) {
  const [stats, setStats] = useState<ZoneStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 🟢 Lấy thống kê zone
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getZoneStats();
      const raw: any = res?.data || {};

      const total = raw.total || 0;
      const active =
        raw.byStatus?.find((s: any) => s._id === "ACTIVE")?.count || 0;
      const inactive =
        raw.byStatus?.find((s: any) => s._id === "INACTIVE")?.count || 0;
      const createdThisMonth = raw.createdThisMonth || 0;

      setStats({
        totalZones: total,
        activeZones: active,
        inactiveZones: inactive,
        newZonesThisMonth: createdThisMonth,
      });
    } catch (err) {
      console.error("[ZoneStatsCards] fetchStats error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⏱ Auto refresh mỗi 60 giây
  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      handleRefresh();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔁 Làm mới thủ công
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setTimeout(() => setRefreshing(false), 800);
  };

  // 🎨 Danh sách các thẻ thống kê
  const items = [
    {
      label: "Tổng số khu vực",
      value: stats?.totalZones ?? 0,
      icon: LayoutGrid,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600 bg-blue-200",
    },
    {
      label: "Đang hoạt động",
      value: stats?.activeZones ?? 0,
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      iconColor: "text-green-600 bg-green-200",
    },
    {
      label: "Ngừng hoạt động",
      value: stats?.inactiveZones ?? 0,
      icon: XCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600 bg-red-200",
    },
    {
      label: "Zone mới trong tháng",
      value: stats?.newZonesThisMonth ?? 0,
      icon: PlusCircle,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600 bg-purple-200",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </Card>
            ))
          : items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card
                  className={`border-none shadow-sm hover:shadow-md transition-all duration-300 ${
                    item.bgColor
                  } ${refreshing ? "animate-pulse" : ""}`}
                >
                  <CardHeader className="flex flex-row items-start justify-between pb-1">
                    <CardTitle className="text-sm font-medium text-gray-700">
                      {item.label}
                    </CardTitle>
                    <div
                      className={`p-2 rounded-full ${item.iconColor} bg-opacity-60`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={item.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: -4 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                        className="text-3xl font-semibold text-gray-900"
                      >
                        {item.value.toLocaleString()}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
