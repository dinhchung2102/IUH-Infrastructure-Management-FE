"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Layers, Wrench, ImageOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getAssetStatsDashboard } from "../api/stats.api";
import type { AssetDashboardStats } from "../api/stats.api";

export interface AssetStatsCardsProps {
  stats?: AssetDashboardStats;
  loading?: boolean;
  onRefresh?: () => Promise<void>;
}


export function AssetStatsCards(_props: AssetStatsCardsProps = {}) {
  const [stats, setStats] = useState<AssetDashboardStats | null>(_props.stats ?? null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 📊 Fetch thống kê Dashboard
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getAssetStatsDashboard();
setStats(res?.data ?? null);

// trỏ đúng tới object AssetDashboardStats

    } catch (err) {
      console.error("[AssetStatsCards] fetchStats error:", err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // ⏱ Tự động làm mới mỗi 60 giây
  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => handleRefresh(), 60000);
    return () => clearInterval(interval);
  }, []);

  // 🔁 Làm mới thủ công
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setTimeout(() => setRefreshing(false), 800);
  };

  // 🎨 Cấu hình các thẻ thống kê
  const items = [
    {
      label: "Tổng thiết bị",
      value: stats?.totalAssets ?? 0,
      icon: Package,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600 bg-blue-200",
    },
    {
      label: "Đang sử dụng",
      value: stats?.assetsByStatus?.IN_USE ?? 0,
      icon: Layers,
      bgColor: "bg-green-50",
      iconColor: "text-green-600 bg-green-200",
    },
    {
      label: "Đang bảo trì",
      value: stats?.assetsByStatus?.UNDER_MAINTENANCE ?? 0,
      icon: Wrench,
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600 bg-yellow-200",
    },
    {
      label: "Hư hỏng",
      value: stats?.assetsByStatus?.DAMAGED ?? 0,
      icon: ImageOff,
      bgColor: "bg-red-50",
      iconColor: "text-red-600 bg-red-200",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </Card>
            ))
          : items.map((item, idx) => {
              const Icon = item.icon; // fix dynamic icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <Card
                    className={`border-none shadow-sm hover:shadow-md transition-all duration-300 ${item.bgColor} ${
                      refreshing ? "animate-pulse" : ""
                    }`}
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-1">
                      <CardTitle className="text-sm font-medium text-gray-700">
                        {item.label}
                      </CardTitle>
                      <div className={`p-2 rounded-full ${item.iconColor} bg-opacity-60`}>
                        <Icon className="w-5 h-5" />
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
              );
            })}
      </div>
    </div>
  );
}
