import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { getAuditsByStaff } from "../../statistics/api/statistics.api";
import type { AuditByStaffData } from "../../statistics/api/statistics.api";
import { toast } from "sonner";

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

interface StaffStatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StaffStatsDialog({
  open,
  onOpenChange,
}: StaffStatsDialogProps) {
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
    if (open) {
      fetchAuditsByStaff();
    }
  }, [open, fetchAuditsByStaff]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Thống kê nhiệm vụ theo nhân viên</DialogTitle>
          <DialogDescription>
            Tỷ lệ hoàn thành nhiệm vụ của từng nhân viên
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4">
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <Loader2 className="h-6 w-6 animate-spin" />
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
                      <TableCell className="text-center font-semibold">
                        {staff.total}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-green-600">
                        {staff.completed}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-yellow-600">
                        {staff.inProgress}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-gray-600">
                        {staff.pending}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-bold text-lg">
                          {staff.completionRate.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
