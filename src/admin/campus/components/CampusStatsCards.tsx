"use client";

import { useEffect, useState } from "react";
import { getCampusStats } from "../api/campus.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, CheckCircle2, XCircle, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CampusStats {
  totalCampus: number;
  activeCampus: number;
  inactiveCampus: number;
  newCampusThisMonth: number;
}

interface CampusStatsCardsProps {
  stats?: any;
  onRefresh?: () => Promise<void>;
  loading?: boolean;
}

export function CampusStatsCards(_props: CampusStatsCardsProps = {}) {
  const [stats, setStats] = useState<CampusStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

 const fetchStats = async () => {
  try {
    setLoading(true);
    const res = await getCampusStats();

    // ✅ ép kiểu rõ ràng để tránh lỗi
    const stats = (res?.stats ?? {}) as {
      total?: number;
      active?: number;
      inactive?: number;
      newThisMonth?: number;
    };

    setStats({
      totalCampus: stats.total ?? 0,
      activeCampus: stats.active ?? 0,
      inactiveCampus: stats.inactive ?? 0,
      newCampusThisMonth: stats.newThisMonth ?? 0,
    });
  } catch (err) {
    console.error("[CampusStatsCards] fetchStats error:", err);
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

  // 🎨 Cấu hình từng thẻ thống kê
  const items = [
    {
      label: "Tổng số cơ sở",
      value: stats?.totalCampus ?? 0,
      icon: Building2,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600 bg-blue-200",
    },
    {
      label: "Đang hoạt động",
      value: stats?.activeCampus ?? 0,
      icon: CheckCircle2,
      bgColor: "bg-green-50",
      iconColor: "text-green-600 bg-green-200",
    },
    {
      label: "Ngừng hoạt động",
      value: stats?.inactiveCampus ?? 0,
      icon: XCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600 bg-red-200",
    },
    {
      label: "Cơ sở mới tháng này",
      value: stats?.newCampusThisMonth ?? 0,
      icon: PlusCircle,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600 bg-purple-200",
    },
  ];

  return (
    <div className="space-y-3">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Thống kê cơ sở</h2>
        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCcw
            className={`w-4 h-4 transition-transform ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          Làm mới
        </Button>
      </div> */}

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
