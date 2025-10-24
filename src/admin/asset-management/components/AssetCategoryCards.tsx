"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  BarChart3,
  CheckCircle2,
  XCircle,
  PlusCircle,
} from "lucide-react";

interface Props {
  stats: {
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  };
  onViewStats: () => void;
  onAddNew: () => void;
}

export function AssetCategoryCards({ stats, onViewStats, onAddNew }: Props) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Building2 className="text-primary" />
          Quản lý danh mục thiết bị
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewStats}>
            <BarChart3 className="size-4 mr-2" /> Xem thống kê
          </Button>
          <Button onClick={onAddNew}>
            <Plus className="size-4 mr-2" /> Thêm danh mục
          </Button>
        </div>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tổng danh mục */}
        <Card className="bg-blue-50 border-blue-100 hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">Tổng danh mục</p>
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <Building2 className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-3 text-gray-800">{stats.total}</p>
          </CardContent>
        </Card>

        {/* Đang hoạt động */}
        <Card className="bg-green-50 border-green-100 hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <div className="bg-green-100 text-green-600 p-2 rounded-full">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-3 text-gray-800">
              {stats.active}
            </p>
          </CardContent>
        </Card>

        {/* Ngừng hoạt động */}
        <Card className="bg-red-50 border-red-100 hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">Ngừng hoạt động</p>
              <div className="bg-red-100 text-red-600 p-2 rounded-full">
                <XCircle className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-3 text-gray-800">
              {stats.inactive}
            </p>
          </CardContent>
        </Card>

        {/* Mới tháng này */}
        <Card className="bg-purple-50 border-purple-100 hover:shadow-md transition">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-600">Mới tháng này</p>
              <div className="bg-purple-100 text-purple-600 p-2 rounded-full">
                <PlusCircle className="size-4" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-3 text-gray-800">
              {stats.newThisMonth}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
