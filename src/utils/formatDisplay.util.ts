export const getRoleDisplay = (role?: string) => {
  const roleMap: Record<string, string> = {
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    STUDENT: "Sinh viên",
    TEACHER: "Giảng viên",
    GUEST: "Người dùng",
  };
  return roleMap[role || ""] || role || "Người dùng";
};

export const getFirstName = (fullName?: string | null) => {
  if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
    return "User";
  }

  try {
    // Split by space and get last part (Vietnamese naming: Họ Tên_Đệm Tên)
    const parts = fullName.trim().split(" ");
    return parts[parts.length - 1] || "User";
  } catch {
    return "User";
  }
};

export const getUserInitials = (fullName?: string | null) => {
  if (!fullName || typeof fullName !== "string" || fullName.trim() === "") {
    return "U";
  }

  try {
    // Lấy chữ cái đầu của tên (phần cuối cùng trong họ tên đã được cắt)
    const parts = fullName.trim().split(" ");
    const lastName = parts[parts.length - 1];
    const initial = lastName?.[0]?.toUpperCase() || "U";
    return initial;
  } catch {
    return "U";
  }
};
