/**
 * Utility functions for role management
 */

/**
 * Format role name from English to Vietnamese
 * @param {string} roleName - Role name in English
 * @returns {string} Role name in Vietnamese
 */
export const formatRoleToVietnamese = (roleName) => {
  const roleMap = {
    ADMIN: "Quản trị viên",
    STAFF: "Nhân viên",
    STUDENT: "Sinh viên",
    GUEST: "Khách",
    CAMPUS_ADMIN: "Quản trị cơ sở",
    // Add more roles as needed
  };

  return roleMap[roleName] || roleName || "Không xác định";
};

/**
 * Get role color for UI components
 * @param {string} roleName - Role name
 * @returns {string} Material-UI color name
 */
export const getRoleColor = (roleName) => {
  const colorMap = {
    ADMIN: "error",
    STAFF: "warning",
    STUDENT: "info",
    GUEST: "default",
    CAMPUS_ADMIN: "primary",
  };

  return colorMap[roleName] || "default";
};

/**
 * Get all available roles with Vietnamese labels
 * @returns {Array} Array of role objects with value and label
 */
export const getRoleOptions = () => [
  { value: "", label: "Tất cả" },
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "STAFF", label: "Nhân viên" },
  { value: "STUDENT", label: "Sinh viên" },
  { value: "GUEST", label: "Khách" },
];
