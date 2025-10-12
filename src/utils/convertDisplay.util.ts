import type { RoleName } from "@/types/role.enum";

export const converDateToDisplay = (date: string) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const converGenderToDisplay = (gender: "MALE" | "FEMALE") => {
  return gender === "MALE" ? "Nam" : "Nữ";
};

export const converRoleToDisplay = (role: RoleName) => {
  switch (role) {
    case "ADMIN":
      return "Quản trị viên";
    case "STAFF":
      return "Nhân viên";
    case "STUDENT":
      return "Sinh viên";
    case "LECTURER":
      return "Giảng viên";
    case "GUEST":
      return "Người dùng";
    case "CAMPUS_ADMIN":
      return "Quản trị cơ sở";
    default:
      return role || "Người dùng";
  }
};
