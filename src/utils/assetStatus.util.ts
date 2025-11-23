/**
 * Utility functions for Asset Status
 */

import { ASSET_STATUS_BADGE, getBadgeConfig } from "@/config/badge.config";
import type { AssetStatus } from "@/config/badge.config";

export const getAssetStatusLabel = (status: string): string => {
  const config = getBadgeConfig(ASSET_STATUS_BADGE, status as AssetStatus);
  return config.label;
};

export const getAssetStatusConfig = (
  status: string
): { label: string; className: string } => {
  const config = getBadgeConfig(ASSET_STATUS_BADGE, status as AssetStatus);
  return {
    label: config.label,
    className: config.className,
  };
};
