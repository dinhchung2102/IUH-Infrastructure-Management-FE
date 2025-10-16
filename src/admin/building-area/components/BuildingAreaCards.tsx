"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2, Map, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Giao diện thẻ thống kê cho trang Building-Area
 * Không gọi API, mặc định hiển thị 0 cho tất cả chỉ số
 */
export function BuildingAreaCards() {
  const stats = {
    buildings: 3,
    areas: 0,
    active: 3,
    inactive: 0,
  };

  const items = [
    {
      label: "Tổng số cơ sở",
      value: stats.buildings,
      icon: Building2,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      label: "Đang hoạt động",
      value: stats.active,
      icon: CheckCircle2,
      bgColor: "bg-green-100",
      iconColor: "text-green-700",
    },
    {
      label: "Ngừng hoạt động",
      value: stats.inactive,
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-700",
    },
    {
      label: "Cơ sở mới tháng này",
      value: stats.areas,
      icon: Map,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: idx * 0.1 }}
        >
          <Card className={`${item.bgColor} shadow-sm hover:shadow-md transition-all`}>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <div className={`p-2 rounded-full ${item.bgColor.replace("-100", "-200")} ${item.iconColor}`}>
                <item.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{item.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

