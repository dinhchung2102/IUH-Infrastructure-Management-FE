import type { RoleName } from "@/types/role.enum";
import type { BaseQueryDto } from "@/types/pagination.type";

// Extend từ BaseQueryDto để tái sử dụng pagination fields
export type QueryStaffDto = BaseQueryDto & {
  search?: string;
  role?: RoleName;
  isActive?: boolean;
  gender?: "MALE" | "FEMALE";
};

export type StaffResponse = {
  _id: string;
  email: string;
  role: {
    _id: string;
    roleName: RoleName;
  };
  isActive: boolean;
  avatar?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  address?: string;
  fullName: string;
  gender?: "MALE" | "FEMALE";
  createdAt: string;
  updatedAt: string;
  __v: number;
  // Managed areas
  campusManaged?: {
    _id: string;
    name: string;
  } | null;
  areasManaged?: Array<{
    _id: string;
    name: string;
  }> | null;
  zonesManaged?: Array<{
    _id: string;
    name: string;
  }> | null;
  buildingsManaged?: Array<{
    _id: string;
    name: string;
  }> | null;
};

// DTO for creating staff
export type CreateStaffDto = {
  email: string;
  password: string;
  fullName: string;
  role: RoleName;
  phoneNumber?: string;
  address?: string;
  gender?: "MALE" | "FEMALE";
  avatar?: string;
};
