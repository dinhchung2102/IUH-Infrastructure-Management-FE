import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle2, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getStaff } from "@/admin/staff-management/api/staff.api";
import type { StaffResponse } from "@/admin/staff-management/types/staff.type";
import type { RoleName } from "@/types/role.enum";
import {
  approveReport,
  getSuggestedStaffs,
  type SuggestedStaff,
} from "../api/report.api";
import type { Report } from "../types/report.type";

interface ApproveReportDialogProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const getUserInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ApproveReportDialog({
  report,
  open,
  onOpenChange,
  onSuccess,
}: ApproveReportDialogProps) {
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [searchStaff, setSearchStaff] = useState("");
  const [expirationDays, setExpirationDays] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Map to store assignedTo info for each staff (for suggested staffs only)
  const [staffAssignments, setStaffAssignments] = useState<
    Map<string, SuggestedStaff["assignedTo"]>
  >(new Map());

  // Transform SuggestedStaff to StaffResponse format for display
  const transformSuggestedStaffToStaffResponse = useCallback(
    (suggested: SuggestedStaff): StaffResponse => {
      return {
        _id: suggested.id,
        email: suggested.email,
        fullName: suggested.fullName,
        phoneNumber: suggested.phoneNumber,
        role: {
          _id: "",
          roleName: suggested.role as RoleName,
        },
        isActive: true,
        createdAt: "",
        updatedAt: "",
        __v: 0,
      };
    },
    []
  );

  // Helper function to get assignedTo label in Vietnamese
  const getAssignedToLabel = (
    assignedTo: SuggestedStaff["assignedTo"]
  ): string => {
    switch (assignedTo) {
      case "zone":
        return "Phụ trách phòng";
      case "building":
        return "Phụ trách tòa nhà";
      case "zoneManaged":
        return "Quản lý phòng";
      case "buildingManaged":
        return "Quản lý tòa nhà";
      default:
        return "";
    }
  };

  // Fetch suggested staffs from API
  const fetchSuggestedStaffs = useCallback(async () => {
    if (!report?._id) return;

    try {
      setLoading(true);
      const response = await getSuggestedStaffs(report._id);
      if (response.success && response.data?.data) {
        // If no suggested staffs, fetch all staff instead
        if (response.data.data.length === 0) {
          // Clear assignments map since we're showing all staff
          setStaffAssignments(new Map());
          // Fetch all staff
          const allStaffResponse = await getStaff({
            page: 1,
            limit: 100,
          });
          if (allStaffResponse.success && allStaffResponse.data) {
            setStaffList(allStaffResponse.data.accounts);
          }
          return;
        }

        // Transform suggested staffs to StaffResponse format
        const transformed = response.data.data.map(
          transformSuggestedStaffToStaffResponse
        );
        setStaffList(transformed);

        // Store assignedTo info for each staff
        const assignmentsMap = new Map<string, SuggestedStaff["assignedTo"]>();
        response.data.data.forEach((suggested) => {
          assignmentsMap.set(suggested.id, suggested.assignedTo);
        });
        setStaffAssignments(assignmentsMap);
      }
    } catch (error) {
      console.error("Error fetching suggested staffs:", error);
      toast.error("Không thể tải danh sách nhân viên gợi ý");
      // Fallback: try to fetch all staff if suggested staffs fails
      try {
        const allStaffResponse = await getStaff({
          page: 1,
          limit: 100,
        });
        if (allStaffResponse.success && allStaffResponse.data) {
          setStaffList(allStaffResponse.data.accounts);
          setStaffAssignments(new Map());
        }
      } catch (fallbackError) {
        console.error("Error fetching all staff as fallback:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, [report?._id, transformSuggestedStaffToStaffResponse]);

  // Fetch all staff (when searching)
  const fetchAllStaff = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getStaff({
        page: 1,
        limit: 100,
        search: searchStaff || undefined,
      });
      if (response.success && response.data) {
        setStaffList(response.data.accounts);
        // Clear assignments map when searching (not suggested staffs)
        setStaffAssignments(new Map());
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  }, [searchStaff]);

  // Fetch staff list - suggested staffs when no search, all staff when searching
  useEffect(() => {
    if (open && report) {
      // Reset search when dialog opens
      setSearchStaff("");
      // Fetch suggested staffs initially
      fetchSuggestedStaffs();
      // Set suggestedProcessingDays as default value if available
      if (report?.suggestedProcessingDays) {
        setExpirationDays(String(report.suggestedProcessingDays));
      } else {
        setExpirationDays("");
      }
    }
  }, [open, report, fetchSuggestedStaffs]);

  // Fetch staff when search changes
  useEffect(() => {
    if (open && report) {
      // Debounce search
      const timeoutId = setTimeout(() => {
        if (searchStaff.trim()) {
          // If searching, fetch all staff
          fetchAllStaff();
        } else {
          // If search is cleared, fetch suggested staffs again
          fetchSuggestedStaffs();
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchStaff, open, report, fetchAllStaff, fetchSuggestedStaffs]);

  const handleToggleStaff = (staffId: string) => {
    setSelectedStaffIds((prev) => {
      if (prev.includes(staffId)) {
        return prev.filter((id) => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  const handleApprove = async () => {
    if (selectedStaffIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 nhân viên");
      return;
    }

    if (!subject.trim()) {
      toast.error("Vui lòng nhập Nội dung nhiệm vụ");
      return;
    }

    if (
      !expirationDays ||
      isNaN(Number(expirationDays)) ||
      Number(expirationDays) <= 0
    ) {
      toast.error("Vui lòng nhập số ngày hết hạn hợp lệ");
      return;
    }

    if (!report) return;

    try {
      setSubmitting(true);

      // Calculate expiresAt: current date + number of days
      const currentDate = new Date();
      const daysToAdd = Number(expirationDays);
      const expiresAt = new Date(currentDate);
      expiresAt.setDate(expiresAt.getDate() + daysToAdd);

      await approveReport({
        reportId: report._id,
        staffIds: selectedStaffIds,
        subject: subject.trim(),
        expiresAt: expiresAt.toISOString(),
      });
      toast.success("Phê duyệt báo cáo thành công!");
      onSuccess();
      onOpenChange(false);
      // Reset form
      setSelectedStaffIds([]);
      setSubject("");
      // Reset to suggestedProcessingDays if available, otherwise empty
      if (report?.suggestedProcessingDays) {
        setExpirationDays(String(report.suggestedProcessingDays));
      } else {
        setExpirationDays("");
      }
    } catch (error) {
      console.error("Error approving report:", error);
      toast.error("Không thể phê duyệt báo cáo");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStaff = staffList.filter((staff) =>
    selectedStaffIds.includes(staff._id)
  );

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Phê duyệt báo cáo
          </DialogTitle>
          <DialogDescription>
            Chọn nhân viên và nhập Nội dung nhiệm vụ để phê duyệt báo cáo này
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subject Input */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Nội dung nhiệm vụ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Ví dụ: Thay thế gương vỡ tại nhà vệ sinh H2"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Selected Staff Display */}
          {selectedStaffIds.length > 0 && (
            <div className="space-y-2">
              <Label>Nhân viên được chọn ({selectedStaffIds.length})</Label>
              <div className="flex flex-wrap gap-2">
                {selectedStaff.map((staff) => (
                  <Badge
                    key={staff._id}
                    variant="secondary"
                    className="pl-1 pr-2 py-1 gap-1"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">
                        {getUserInitials(staff.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{staff.fullName}</span>
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleToggleStaff(staff._id)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Staff Search and Expiration Days - Same Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Staff Search */}
            <div className="space-y-2">
              <Label htmlFor="search-staff">Tìm và chọn nhân viên</Label>
              <Input
                id="search-staff"
                placeholder="Tìm theo tên nhân viên..."
                value={searchStaff}
                onChange={(e) => {
                  setSearchStaff(e.target.value);
                }}
                className="bg-white"
              />
            </div>

            {/* Expiration Days Input */}
            <div className="space-y-2">
              <Label htmlFor="expirationDays">
                Số ngày hết hạn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expirationDays"
                type="number"
                min="1"
                placeholder="Nhập số ngày (ví dụ: 7)"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            Nhiệm vụ sẽ hết hạn sau số ngày được nhập tính từ ngày hiện tại
          </p>

          {/* Staff List */}
          <div className="space-y-2">
            <Label>
              Danh sách nhân viên
              {!searchStaff && report?._id && (
                <span className="text-xs text-muted-foreground ml-2 font-normal">
                  (Gợi ý theo khu vực)
                </span>
              )}
            </Label>
            <div className="border rounded-lg bg-white max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Đang tải...
                  </p>
                </div>
              ) : staffList.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Không tìm thấy nhân viên
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {staffList.map((staff) => (
                    <div
                      key={staff._id}
                      className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                        selectedStaffIds.includes(staff._id)
                          ? "bg-primary/5"
                          : ""
                      }`}
                      onClick={() => handleToggleStaff(staff._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(staff.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">
                                {staff.fullName}
                              </p>
                              {staffAssignments.has(staff._id) && (
                                <Badge variant="secondary" className="text-xs">
                                  {getAssignedToLabel(
                                    staffAssignments.get(staff._id)!
                                  )}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {staff.email}
                            </p>
                          </div>
                        </div>
                        {selectedStaffIds.includes(staff._id) && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="cursor-pointer text-red-600 hover:text-red-700"
          >
            Hủy
          </Button>
          <Button
            onClick={handleApprove}
            disabled={
              submitting ||
              selectedStaffIds.length === 0 ||
              !subject.trim() ||
              !expirationDays ||
              isNaN(Number(expirationDays)) ||
              Number(expirationDays) <= 0
            }
            className="bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang phê duyệt...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Phê duyệt
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
