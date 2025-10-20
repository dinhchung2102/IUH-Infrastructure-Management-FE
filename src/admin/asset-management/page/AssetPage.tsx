"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageOff, Wrench, Package, Layers, Plus } from "lucide-react";
import { getAssets } from "../api/asset.api";
import { toast } from "sonner";

export default function AssetPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 📦 Fetch danh sách tài sản
  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await getAssets();
      if (res?.success) setAssets(res.data?.assets || []);
      else toast.error(res?.message || "Không thể tải danh sách thiết bị.");
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách thiết bị:", error);
      toast.error("Không thể tải danh sách thiết bị.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // 🧩 Trạng thái sử dụng
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "IN_USE":
        return <Badge variant="default">Đang sử dụng</Badge>;
      case "MAINTENANCE":
        return <Badge variant="secondary">Bảo trì</Badge>;
      case "BROKEN":
        return <Badge variant="destructive">Hư hỏng</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý thiết bị
          </h1>
          <p className="text-muted-foreground">
            Danh sách và tình trạng thiết bị trong hệ thống.
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" /> Thêm thiết bị
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Tổng thiết bị
            </CardTitle>
            <Package className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">Tổng số thiết bị</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Thiết bị đang sử dụng
            </CardTitle>
            <Layers className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter((a) => a.status === "IN_USE").length}
            </div>
            <p className="text-xs text-muted-foreground">Hoạt động tốt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Đang bảo trì</CardTitle>
            <Wrench className="size-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter((a) => a.status === "MAINTENANCE").length}
            </div>
            <p className="text-xs text-muted-foreground">Chờ hoàn tất</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Hư hỏng</CardTitle>
            <ImageOff className="size-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter((a) => a.status === "BROKEN").length}
            </div>
            <p className="text-xs text-muted-foreground">Cần xử lý</p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thiết bị</CardTitle>
          <CardDescription>
            Quản lý thông tin chi tiết của từng thiết bị.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên thiết bị</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Khu vực</TableHead>
                  <TableHead>Vị trí</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày cập nhật</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Đang tải dữ liệu...
                    </TableCell>
                  </TableRow>
                ) : assets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Không có thiết bị nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  assets.map((asset) => (
                    <TableRow key={asset._id} className="hover:bg-muted/50">
                      <TableCell>
                        {asset.image ? (
                          <img
                            src={asset.image}
                            alt={asset.name}
                            className="size-12 rounded-md object-cover border"
                          />
                        ) : (
                          <div className="flex items-center justify-center size-12 bg-muted rounded-md text-muted-foreground">
                            <ImageOff className="size-5" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {asset.name}
                        <div className="text-xs text-muted-foreground">
                          Mã: {asset.code}
                        </div>
                      </TableCell>
                      <TableCell>{asset.assetType?.name || "—"}</TableCell>
                      <TableCell>
                        {asset.assetCategory?.name || "—"}
                      </TableCell>
                      <TableCell>{asset.zone?.name || "—"}</TableCell>
                      <TableCell>
                        {asset.zone?.building?.name
                          ? `${asset.zone.building.name} - Tầng ${asset.zone.floorLocation || "?"}`
                          : "—"}
                      </TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>
                        {new Date(asset.updatedAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
