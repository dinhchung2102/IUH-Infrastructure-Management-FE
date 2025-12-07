import React from "react";
import type { StaffResponse, QueryStaffDto } from "../types/staff.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAccountStatusBadge } from "@/config/badge.config";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mars,
  Venus,
  ChevronsUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import { TableActionMenu } from "@/components/TableActionMenu";
import {
  converGenderToDisplay,
  converRoleToDisplay,
} from "@/utils/convertDisplay.util";
import type { PaginationRequest } from "@/types/pagination.type";
import type { RoleName } from "@/types/role.enum";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleSelect } from "@/components/RoleSelect";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
  getStaffById,
  lockStaff,
  unlockStaff,
  deleteStaff,
} from "../api/staff-actions.api";
import { AssignLocationDialog } from "./AssignLocationDialog";

interface StaffTableProps {
  staff: StaffResponse[];
  loading: boolean;
  paginationRequest: PaginationRequest;
  filters: {
    search: string;
    isActive?: boolean;
    gender?: "MALE" | "FEMALE";
    role?: RoleName;
  };
  onFiltersChange: (filters: Partial<QueryStaffDto>) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onStaffStatusUpdate?: (staffId: string, newStatus: boolean) => void;
}

export default function StaffTable({
  staff,
  loading,
  paginationRequest,
  filters,
  onFiltersChange,
  onSortChange,
  onStaffStatusUpdate,
}: StaffTableProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search);
  const [selectedStaffForAssign, setSelectedStaffForAssign] =
    React.useState<StaffResponse | null>(null);

  // Sync searchInput với filters.search khi clear từ bên ngoài
  React.useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  const handleSort = (field: string) => {
    const newOrder =
      paginationRequest.sortBy === field &&
      paginationRequest.sortOrder === "asc"
        ? "desc"
        : "asc";
    onSortChange(field, newOrder);
  };

  const getSortIcon = (field: string) => {
    if (paginationRequest.sortBy !== field) {
      return <ChevronsUpDown className="h-4 w-4" />;
    }
    return paginationRequest.sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFiltersChange({ search: searchInput });
  };

  const handleViewDetails = async (staffId: string) => {
    try {
      const response = await getStaffById(staffId);
      console.log("Chi tiết nhân sự:", response.data);

      // TODO: Mở dialog hoặc navigate đến trang chi tiết
      toast.success(
        `Đã tải thông tin nhân sự ${
          response?.data?.fullName || response?.data?.email || "N/A"
        }`
      );
    } catch (error) {
      console.error("Lỗi khi tải chi tiết nhân sự:", error);
      toast.error("Không thể tải thông tin nhân sự");
    }
  };

  const handleToggleStaffStatus = async (
    staffId: string,
    currentStatus: boolean
  ) => {
    try {
      let response;
      const newStatus = !currentStatus; // Trạng thái mới sau khi toggle

      if (currentStatus) {
        // Lock staff
        response = await lockStaff(staffId);
        console.log("Đã khóa tài khoản nhân sự:", response.data);
        toast.success("Tài khoản nhân sự đã được khóa");
      } else {
        // Unlock staff
        response = await unlockStaff(staffId);
        console.log("Đã mở khóa tài khoản nhân sự:", response.data);
        toast.success("Tài khoản nhân sự đã được mở khóa");
      }

      // Cập nhật UI ngay lập tức
      onStaffStatusUpdate?.(staffId, newStatus);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái nhân sự:", error);
      toast.error("Không thể cập nhật trạng thái nhân sự");
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản nhân sự này?")) {
      return;
    }

    try {
      await deleteStaff(staffId);
      console.log("Đã xóa tài khoản nhân sự:", staffId);

      toast.success("Tài khoản nhân sự đã được xóa");

      // TODO: Refresh danh sách nhân sự
      // onRefresh?.();
    } catch (error) {
      console.error("Lỗi khi xóa nhân sự:", error);
      toast.error("Không thể xóa nhân sự");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[250px] space-y-2">
          <Label>Tìm kiếm</Label>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Tìm kiếm theo email, tên..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" variant="default" className="cursor-pointer">
              Tìm kiếm
            </Button>
          </form>
        </div>

        <div className="space-y-2">
          <Label>Vai trò</Label>
          <RoleSelect
            value={filters.role || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                role: value === "all" ? undefined : (value as RoleName),
              })
            }
            placeholder="Vai trò"
            className="w-[180px] bg-white cursor-pointer"
            includeAllOption={true}
            allOptionLabel="Tất cả vai trò"
            showLabel={false}
          />
        </div>

        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select
            value={
              filters.isActive === undefined
                ? "all"
                : filters.isActive
                ? "active"
                : "inactive"
            }
            onValueChange={(value) =>
              onFiltersChange({
                isActive:
                  value === "all"
                    ? undefined
                    : value === "active"
                    ? true
                    : false,
              })
            }
          >
            <SelectTrigger className="w-[180px] bg-white cursor-pointer">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Tất cả trạng thái
              </SelectItem>
              <SelectItem value="active" className="cursor-pointer">
                Hoạt động
              </SelectItem>
              <SelectItem value="inactive" className="cursor-pointer">
                Đã khóa
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Giới tính</Label>
          <Select
            value={filters.gender || "all"}
            onValueChange={(value) =>
              onFiltersChange({
                gender:
                  value === "all" ? undefined : (value as "MALE" | "FEMALE"),
              })
            }
          >
            <SelectTrigger className="w-[180px] bg-white cursor-pointer">
              <SelectValue placeholder="Giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">
                Tất cả giới tính
              </SelectItem>
              <SelectItem value="MALE" className="cursor-pointer">
                Nam
              </SelectItem>
              <SelectItem value="FEMALE" className="cursor-pointer">
                Nữ
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ClearFiltersButton
          onClick={() => {
            setSearchInput("");
            onFiltersChange({
              search: "",
              isActive: undefined,
              gender: undefined,
              role: undefined,
            });
          }}
        />
      </div>

      {/* Table Section */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[50px]">STT</TableHead>
              <TableHead className="w-[80px]">Ảnh đại diện</TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("fullName")}
                  className="h-8 px-2 lg:px-3"
                >
                  Họ tên
                  {getSortIcon("fullName")}
                </Button>
              </TableHead>
              <TableHead className="w-[220px]">Thông tin liên hệ</TableHead>
              <TableHead className="w-[130px]">Vai trò</TableHead>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("gender")}
                  className="h-8 px-2 lg:px-3"
                >
                  Giới tính
                  {getSortIcon("gender")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("isActive")}
                  className="h-8 px-2 lg:px-3"
                >
                  Trạng thái
                  {getSortIcon("isActive")}
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">Khu vực phụ trách</TableHead>
              <TableHead className="text-center w-[80px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && staff.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Không có nhân sự nào.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableSkeleton
                rows={paginationRequest.limit}
                columns={[
                  { type: "number", width: "w-[50px]", align: "center" },
                  { type: "avatar", width: "w-[80px]" },
                  { type: "text", width: "w-[150px]" },
                  { type: "text", width: "w-[220px]" },
                  { type: "badge", width: "w-[130px]" },
                  { type: "text", width: "w-[100px]" },
                  { type: "badge", width: "w-[120px]" },
                  { type: "text", width: "w-[150px]" },
                  { type: "text", width: "w-[80px]", align: "center" },
                ]}
              />
            )}
            {!loading &&
              staff.map((staffMember, idx) => (
                <TableRow key={staffMember._id}>
                  <TableCell className="text-center">
                    {(paginationRequest.page - 1) * paginationRequest.limit +
                      idx +
                      1}
                  </TableCell>
                  <TableCell>
                    <Avatar className="size-12">
                      <AvatarImage
                        src={staffMember.avatar}
                        alt={staffMember.fullName}
                      />
                      <AvatarFallback>
                        {staffMember.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "??"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {staffMember.fullName || "Chưa có tên"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {staffMember.email}
                        </span>
                      </div>
                      {staffMember.phoneNumber && (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {staffMember.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {converRoleToDisplay(staffMember.role.roleName) ||
                        "Chưa xác định"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      {staffMember.gender === "MALE" ? (
                        <>
                          <Mars className="w-4 h-4" color="blue" />
                          {converGenderToDisplay("MALE")}
                        </>
                      ) : staffMember.gender === "FEMALE" ? (
                        <>
                          <Venus className="w-4 h-4" color="red" />
                          {converGenderToDisplay("FEMALE")}
                        </>
                      ) : (
                        "Chưa xác định"
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getAccountStatusBadge(staffMember.isActive)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1.5 text-sm">
                      <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                      <div className="space-y-2">
                        {staffMember.campusManaged && (
                          <div>
                            <div className="font-medium text-foreground text-xs">
                              Cơ sở:
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {staffMember.campusManaged.name}
                            </div>
                          </div>
                        )}
                        {staffMember.buildingsManaged &&
                          staffMember.buildingsManaged.length > 0 && (
                            <div>
                              <div className="font-medium text-foreground text-xs">
                                Tòa nhà:
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {staffMember.buildingsManaged
                                  .map((b) => b.name)
                                  .join(", ")}
                              </div>
                            </div>
                          )}
                        {staffMember.zonesManaged &&
                          staffMember.zonesManaged.length > 0 && (
                            <div>
                              <div className="font-medium text-foreground text-xs">
                                Khu vực nội bộ:
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {staffMember.zonesManaged
                                  .map((z) => z.name)
                                  .join(", ")}
                              </div>
                            </div>
                          )}
                        {staffMember.areasManaged &&
                          staffMember.areasManaged.length > 0 && (
                            <div>
                              <div className="font-medium text-foreground text-xs">
                                Khu vực ngoài trời:
                              </div>
                              <div className="text-muted-foreground text-xs">
                                {staffMember.areasManaged
                                  .map((a) => a.name)
                                  .join(", ")}
                              </div>
                            </div>
                          )}
                        {!staffMember.campusManaged &&
                          (!staffMember.buildingsManaged ||
                            staffMember.buildingsManaged.length === 0) &&
                          (!staffMember.zonesManaged ||
                            staffMember.zonesManaged.length === 0) &&
                          (!staffMember.areasManaged ||
                            staffMember.areasManaged.length === 0) && (
                            <span className="text-muted-foreground text-xs">
                              Chưa phân công
                            </span>
                          )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <TableActionMenu
                      showLabel
                      actions={[
                        {
                          label: "Xem chi tiết",
                          icon: Eye,
                          onClick: () => handleViewDetails(staffMember._id),
                        },
                        {
                          label: "Phân công khu vực",
                          icon: Building2,
                          onClick: () => setSelectedStaffForAssign(staffMember),
                        },
                        {
                          label: staffMember.isActive
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản",
                          icon: staffMember.isActive ? UserX : UserCheck,
                          onClick: () =>
                            handleToggleStaffStatus(
                              staffMember._id,
                              staffMember.isActive
                            ),
                          customContent: (
                            <>
                              {staffMember.isActive ? (
                                <>
                                  <UserX className="h-4 w-4" />
                                  Khóa tài khoản
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4" />
                                  Mở khóa tài khoản
                                </>
                              )}
                            </>
                          ),
                        },
                        {
                          label: "Xóa tài khoản",
                          icon: Trash2,
                          onClick: () => handleDeleteStaff(staffMember._id),
                          variant: "destructive",
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Assign Location Dialog */}
      <AssignLocationDialog
        open={!!selectedStaffForAssign}
        onOpenChange={(open) => !open && setSelectedStaffForAssign(null)}
        staff={selectedStaffForAssign}
        onSuccess={() => {
          setSelectedStaffForAssign(null);
          // Trigger refresh by calling a parent callback if available
          window.location.reload();
        }}
      />
    </div>
  );
}
