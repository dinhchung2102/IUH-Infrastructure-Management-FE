import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { AuditByStaffData } from "../api/statistics.api";

interface AuditsTabProps {
  auditsByStaff: AuditByStaffData[];
  loading: boolean;
}

export function AuditsTab({ auditsByStaff, loading }: AuditsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhiệm vụ theo nhân viên</CardTitle>
        <CardDescription>
          Tỷ lệ hoàn thành nhiệm vụ của từng nhân viên
        </CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

