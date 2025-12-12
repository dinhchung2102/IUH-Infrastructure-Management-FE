export const AssetStatus = {
  NEW: "NEW",
  IN_USE: "IN_USE",
  UNDER_MAINTENANCE: "UNDER_MAINTENANCE",
  DAMAGED: "DAMAGED",
  LOST: "LOST",
  DISPOSED: "DISPOSED",
  TRANSFERRED: "TRANSFERRED",
} as const;

export type AssetStatus = (typeof AssetStatus)[keyof typeof AssetStatus];
