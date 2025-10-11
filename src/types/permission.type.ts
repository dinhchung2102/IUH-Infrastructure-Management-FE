export const Permission = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  ADMINACTION: "ADMINACTION",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export const Resource = {
  ACCOUNT: "ACCOUNT",
  ROLE: "ROLE",
  PERMISSION: "PERMISSION",
  REPORT: "REPORT",
  AREA: "AREA",
  BUILDING: "BUILDING",
  ZONE: "ZONE",
  ASSET: "ASSET",
  CAMPUS: "CAMPUS",
  ASSET_CATEGORY: "ASSET_CATEGORY",
  ASSET_TYPE: "ASSET_TYPE",
  AUDIT: "AUDIT",
} as const;

export type Resource = (typeof Resource)[keyof typeof Resource];

export type PermissionString = `${Resource}:${Permission}`;

export function parsePermission(
  value: string
): { resource: Resource; action: Permission } | null {
  const [resource, action] = value.split(":");

  if (
    Object.values(Resource).includes(resource as Resource) &&
    Object.values(Permission).includes(action as Permission)
  ) {
    return { resource: resource as Resource, action: action as Permission };
  }

  return null;
}
