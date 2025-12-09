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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTopReporters } from "../api/report.api";
import type { TopReporterItem } from "../api/report.api";

export function TopReportersTab() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TopReporterItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getTopReporters({ limit: 10 });
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
        console.error("Error fetching top reporters:", error);
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Reporters (Người tạo báo cáo nhiều nhất)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">STT</TableHead>
              <TableHead>Người dùng</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Tổng số</TableHead>
              <TableHead className="text-center">Sự cố</TableHead>
              <TableHead className="text-center">Bảo trì</TableHead>
              <TableHead className="text-center">Yêu cầu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.userId}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(item.userName)}</AvatarFallback>
                    </Avatar>
                    <span>{item.userName}</span>
                  </div>
                </TableCell>
                <TableCell>{item.userEmail}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

