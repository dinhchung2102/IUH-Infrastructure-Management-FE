import { useState, useEffect, useCallback } from "react";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuditsByStaff } from "../../statistics/api/statistics.api";
import type { AuditByStaffData } from "../../statistics/api/statistics.api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// Helper function to handle nested data structure
function extractData<T>(responseData: T | { data: T }): T {
  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData
  ) {
    return (responseData as { data: T }).data;
  }
  return responseData;
}

export default function StaffStatisticsPage() {
  const [auditsByStaff, setAuditsByStaff] = useState<AuditByStaffData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAuditsByStaff = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAuditsByStaff();

      if (response.success && response.data) {
        // Handle nested data structure: response.data.data or response.data
        const data = extractData(response.data);
        setAuditsByStaff(Array.isArray(data) ? data : []);
      } else {
        toast.error(
          response.message || "Không thể tải thống kê nhiệm vụ theo nhân viên"
        );
      }
    } catch (error) {
      console.error("Error fetching audits by staff:", error);
      toast.error("Lỗi khi tải thống kê nhiệm vụ theo nhân viên");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuditsByStaff();
  }, [fetchAuditsByStaff]);

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        items={[
          { label: "Dashboard", href: "/admin" },
          { label: "Báo cáo & Thống kê", href: "/admin/reports/statistics" },
          { label: "Thống kê nhân sự", isCurrent: true },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Thống kê nhiệm vụ theo nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : auditsByStaff.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              Không có dữ liệu
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] text-center">STT</TableHead>
                    <TableHead>Tên nhân viên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Tổng</TableHead>
                    <TableHead className="text-center text-green-600">
                      Hoàn thành
                    </TableHead>
                    <TableHead className="text-center text-yellow-600">
                      Đang xử lý
                    </TableHead>
                    <TableHead className="text-center text-gray-600">
                      Chờ xử lý
                    </TableHead>
                    <TableHead className="text-center">
                      Tỷ lệ hoàn thành
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditsByStaff.map((staff, index) => (
                    <TableRow key={staff.staffId}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {staff.staffName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {staff.staffEmail}
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {staff.total}
                      </TableCell>
                      <TableCell className="text-center text-green-600">
                        {staff.completed}
                      </TableCell>
                      <TableCell className="text-center text-yellow-600">
                        {staff.inProgress}
                      </TableCell>
                      <TableCell className="text-center text-gray-600">
                        {staff.pending}
                      </TableCell>
                      <TableCell className="text-center">
                        {staff.completionRate.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

