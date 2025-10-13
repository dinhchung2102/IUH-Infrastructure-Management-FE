export const RoleName = {
  ADMIN: "ADMIN",
  GUEST: "GUEST",
  STUDENT: "STUDENT",
  LECTURER: "LECTURER",
  STAFF: "STAFF",
  CAMPUS_ADMIN: "CAMPUS_ADMIN",
} as const;

export type RoleName = (typeof RoleName)[keyof typeof RoleName];
