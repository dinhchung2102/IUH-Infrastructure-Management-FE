import type { RoleName } from "@/types/role.enum";
import type { BaseQueryDto } from "@/types/pagination.type";

// Extend từ BaseQueryDto để tái sử dụng pagination fields
export type QueryAccountsDto = BaseQueryDto & {
  search?: string;
  role?: RoleName;
  isActive?: boolean;
  gender?: "MALE" | "FEMALE";
};

export type AccountResponse = {
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
  gender: "MALE" | "FEMALE";
  createdAt: string;
  updatedAt: string;
  __v: number;
};
