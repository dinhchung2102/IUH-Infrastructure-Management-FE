import React from "react";
import type { AccountResponse, QueryAccountsDto } from "../types/account.type";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAccountStatusBadge, getRoleBadge } from "@/config/badge.config";
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
import { toast } from "sonner";
import { TableSkeleton } from "@/components/TableSkeleton";
import {
  getAccountById,
  lockAccount,
  unlockAccount,
  deleteAccount,
} from "../api/account-actions.api";

interface AccountTableProps {
  accounts: AccountResponse[];
  loading: boolean;
  paginationRequest: PaginationRequest;
  filters: {
    search: string;
    isActive?: boolean;
    gender?: "MALE" | "FEMALE";
    role?: RoleName;
  };
  onFiltersChange: (filters: Partial<QueryAccountsDto>) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onAccountStatusUpdate?: (accountId: string, newStatus: boolean) => void;
}

export default function AccountTable({
  accounts,
  loading,
  paginationRequest,
  filters,
  onFiltersChange,
  onSortChange,
  onAccountStatusUpdate,
}: AccountTableProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search);

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

  const handleViewDetails = async (accountId: string) => {
    try {
      const response = await getAccountById(accountId);
      console.log("Chi tiết tài khoản:", response.data);

      // TODO: Mở dialog hoặc navigate đến trang chi tiết
      toast.success(
        `Đã tải thông tin tài khoản ${
          response?.data?.fullName || response?.data?.email || "N/A"
        }`
      );
    } catch (error) {
      console.error("Lỗi khi tải chi tiết tài khoản:", error);
      toast.error("Không thể tải thông tin tài khoản");
    }
  };

  const handleToggleAccountStatus = async (
    accountId: string,
    currentStatus: boolean
  ) => {
    try {
      let response;
      const newStatus = !currentStatus; // Trạng thái mới sau khi toggle

      if (currentStatus) {
        // Lock account
        response = await lockAccount(accountId);
        console.log("Đã khóa tài khoản:", response.data);
        toast.success("Tài khoản đã được khóa");
      } else {
        // Unlock account
        response = await unlockAccount(accountId);
        console.log("Đã mở khóa tài khoản:", response.data);
        toast.success("Tài khoản đã được mở khóa");
      }

      // Cập nhật UI ngay lập tức
      onAccountStatusUpdate?.(accountId, newStatus);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái tài khoản:", error);
      toast.error("Không thể cập nhật trạng thái tài khoản");
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      return;
    }

    try {
      await deleteAccount(accountId);
      console.log("Đã xóa tài khoản:", accountId);

      toast.success("Tài khoản đã được xóa");

      // TODO: Refresh danh sách tài khoản
      // onRefresh?.();
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      toast.error("Không thể xóa tài khoản");
    }
  };

  const roleOptions = [
    { value: "ADMIN", label: "Quản trị viên" },
    { value: "CAMPUS_ADMIN", label: "Quản trị cơ sở" },
    { value: "STAFF", label: "Nhân viên" },
    { value: "LECTURER", label: "Giảng viên" },
    { value: "STUDENT", label: "Sinh viên" },
    { value: "GUEST", label: "Khách" },
  ];

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="space-y-3">
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
            <Select
              value={filters.role || "all"}
              onValueChange={(value) =>
                onFiltersChange({
                  role: value === "all" ? undefined : (value as RoleName),
                })
              }
            >
              <SelectTrigger className="w-[180px] bg-white cursor-pointer">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="cursor-pointer">
                  Tất cả vai trò
                </SelectItem>
                {roleOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <div className="space-y-2">
            <Label className="opacity-0">Thao tác</Label>
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
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">STT</TableHead>
              <TableHead>Ảnh đại diện</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("email")}
                  className="h-8 px-2 lg:px-3"
                >
                  Email
                  {getSortIcon("email")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("fullName")}
                  className="h-8 px-2 lg:px-3"
                >
                  Họ tên
                  {getSortIcon("fullName")}
                </Button>
              </TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("gender")}
                  className="h-8 px-2 lg:px-3"
                >
                  Giới tính
                  {getSortIcon("gender")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("isActive")}
                  className="h-8 px-2 lg:px-3"
                >
                  Trạng thái
                  {getSortIcon("isActive")}
                </Button>
              </TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && accounts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Không có tài khoản nào.
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableSkeleton
                rows={paginationRequest.limit}
                columns={[
                  { type: "number", width: "w-8", align: "center" },
                  { type: "avatar" },
                  { type: "text", width: "w-[200px]" },
                  { type: "text", width: "w-[150px]" },
                  { type: "badge", width: "w-[100px]" },
                  { type: "text", width: "w-[80px]" },
                  { type: "badge", width: "w-[110px]" },
                  { type: "text", width: "w-[60px]", align: "center" },
                ]}
              />
            )}
            {!loading &&
              accounts.map((account, idx) => (
                <TableRow key={account._id}>
                  <TableCell className="text-center">
                    {(paginationRequest.page - 1) * paginationRequest.limit +
                      idx +
                      1}
                  </TableCell>
                  <TableCell>
                    <Avatar className="size-12">
                      <AvatarImage
                        src={account.avatar}
                        alt={account.fullName}
                      />
                      <AvatarFallback>
                        {account.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2) || "??"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.fullName || ""}</TableCell>
                  <TableCell>
                    {getRoleBadge(account.role.roleName)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 font-medium">
                      {account.gender === "MALE" ? (
                        <Mars className="w-4 h-4" color="blue" />
                      ) : (
                        <Venus className="w-4 h-4" color="red" />
                      )}
                      {converGenderToDisplay(account.gender) || "Chưa xác định"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getAccountStatusBadge(account.isActive)}
                  </TableCell>
                  <TableCell className="text-center">
                    <TableActionMenu
                      showLabel
                      actions={[
                        {
                          label: "Xem chi tiết",
                          icon: Eye,
                          onClick: () => handleViewDetails(account._id),
                        },
                        {
                          label: account.isActive
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản",
                          icon: account.isActive ? UserX : UserCheck,
                          onClick: () =>
                            handleToggleAccountStatus(
                              account._id,
                              account.isActive
                            ),
                          customContent: (
                            <>
                              {account.isActive ? (
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
                          onClick: () => handleDeleteAccount(account._id),
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
    </div>
  );
}
