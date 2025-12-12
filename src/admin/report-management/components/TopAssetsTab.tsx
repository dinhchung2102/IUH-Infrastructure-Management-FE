import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getTopAssets } from "../api/report.api";
import type { TopAssetItem } from "../api/report.api";

export function TopAssetsTab() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TopAssetItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getTopAssets({ limit: 10 });
        if (response.success && response.data) {
          // Handle nested data structure if needed
          const responseData = Array.isArray(response.data)
            ? response.data
            : (response.data as any)?.data || [];
          setData(Array.isArray(responseData) ? responseData : []);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching top assets:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Không có dữ liệu
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thiết bị có nhiều báo cáo nhất</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">STT</TableHead>
              <TableHead>Tên thiết bị</TableHead>
              <TableHead>Mã thiết bị</TableHead>
              <TableHead className="text-center">Tổng số</TableHead>
              <TableHead className="text-center">Sự cố</TableHead>
              <TableHead className="text-center">Bảo trì</TableHead>
              <TableHead className="text-center">Yêu cầu</TableHead>
              <TableHead className="text-center">Chờ xử lý</TableHead>
              <TableHead className="text-center">Đã duyệt</TableHead>
              <TableHead className="text-center">Đã giải quyết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.assetId}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item.assetName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.assetCode}</Badge>
                </TableCell>
                <TableCell className="text-center font-bold">
                  {item.totalReports}
                </TableCell>
                <TableCell className="text-center">
                  {item.byType?.ISSUE || 0}
                </TableCell>
                <TableCell className="text-center">
                  {item.byType?.MAINTENANCE || 0}
                </TableCell>
                <TableCell className="text-center">
                  {item.byType?.REQUEST || 0}
                </TableCell>
                <TableCell className="text-center">
                  {item.byStatus?.PENDING || 0}
                </TableCell>
                <TableCell className="text-center">
                  {item.byStatus?.APPROVED || 0}
                </TableCell>
                <TableCell className="text-center">
                  {item.byStatus?.RESOLVED || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
