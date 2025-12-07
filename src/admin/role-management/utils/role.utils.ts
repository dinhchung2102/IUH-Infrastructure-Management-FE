// System roles that cannot be edited or deleted
export const SYSTEM_ROLES = [
  "ADMIN",
  "STAFF",
  "CAMPUS_ADMIN",
  "GUEST",
  "STUDENT",
  "LECTURER",
] as const;

/**
 * Check if a role is a system role (default role)
 * @param roleName - The role name to check
 * @returns true if the role is a system role
 */
export function isSystemRole(roleName: string): boolean {
  return SYSTEM_ROLES.includes(roleName as typeof SYSTEM_ROLES[number]);
}

