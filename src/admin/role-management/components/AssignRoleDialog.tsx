import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { getStaff } from "@/admin/staff-management/api/staff.api";
import type { StaffResponse } from "@/admin/staff-management/types/staff.type";
import { assignRole } from "../api/role.api";
import type { Role } from "../types/role.type";
import { converRoleToDisplay } from "@/utils/convertDisplay.util";
import type { RoleName } from "@/types/role.enum";

interface AssignRoleDialogProps {
  roles: Role[];
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

export function AssignRoleDialog({
  roles,
  open,
  onOpenChange,
  onSuccess,
}: AssignRoleDialogProps) {
  const [staffList, setStaffList] = useState<StaffResponse[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [searchStaff, setSearchStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchStaff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, searchStaff]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await getStaff({
        page: 1,
        limit: 50,
        search: searchStaff || undefined,
      });
      if (response.success && response.data) {
        setStaffList(response.data.accounts);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedAccountId) {
      toast.error("Vui lòng chọn tài khoản");
      return;
    }

    if (!selectedRoleId) {
      toast.error("Vui lòng chọn vai trò");
      return;
    }

    try {
      setSubmitting(true);
      await assignRole({
        accountId: selectedAccountId,
        roleId: selectedRoleId,
      });
      toast.success("Gán vai trò thành công!");
      onSuccess();
      onOpenChange(false);
      // Reset
      setSelectedAccountId("");
      setSelectedRoleId("");
    } catch (error) {
      console.error("Error assigning role:", error);
      toast.error("Không thể gán vai trò");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStaff = staffList.find((s) => s._id === selectedAccountId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Gán vai trò cho tài khoản
          </DialogTitle>
          <DialogDescription>
            Chọn tài khoản và vai trò để gán quyền hạn
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Account */}
          <div className="space-y-2">
            <Label htmlFor="search-account">Tìm tài khoản</Label>
            <Input
              id="search-account"
              placeholder="Tìm theo tên hoặc email..."
              value={searchStaff}
              onChange={(e) => setSearchStaff(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Select Account */}
          <div className="space-y-2">
            <Label>
              Chọn tài khoản <span className="text-red-500">*</span>
            </Label>
            {loading ? (
              <div className="border rounded-lg p-8 bg-white text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : (
              <div className="border rounded-lg bg-white max-h-[200px] overflow-y-auto">
                {staffList.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Không tìm thấy tài khoản
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {staffList.map((staff) => (
                      <div
                        key={staff._id}
                        className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                          selectedAccountId === staff._id ? "bg-primary/5" : ""
                        }`}
                        onClick={() => setSelectedAccountId(staff._id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="text-xs">
                              {getUserInitials(staff.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {staff.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {staff.email}
                            </p>
                          </div>
                          {staff.role && (
                            <Badge variant="outline" className="text-xs">
                              {converRoleToDisplay(staff.role.roleName)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected Account Display */}
          {selectedStaff && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">
                Tài khoản đã chọn
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {getUserInitials(selectedStaff.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedStaff.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStaff.email}
                  </p>
                  {selectedStaff.role && (
                    <Badge variant="outline" className="text-xs mt-1">
                      Vai trò hiện tại: {converRoleToDisplay(selectedStaff.role.roleName)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Select Role */}
          <div className="space-y-2">
            <Label>
              Chọn vai trò mới <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Chọn vai trò..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role._id} value={role._id}>
                    {converRoleToDisplay(role.roleName)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={submitting || !selectedAccountId || !selectedRoleId}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang gán...
              </>
            ) : (
              <>
                <UserCog className="h-4 w-4 mr-2" />
                Gán vai trò
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
