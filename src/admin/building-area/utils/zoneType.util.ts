import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ZoneType } from "../api/area.api";

export const zoneTypeDisplay: Record<
  ZoneType,
  { label: string; color: string }
> = {
  FUNCTIONAL: {
    label: "Chức năng",
    color: "bg-purple-100 text-purple-700 border border-purple-300",
  },
  TECHNICAL: {
    label: "Kỹ thuật",
    color: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  SERVICE: {
    label: "Dịch vụ",
    color: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  PUBLIC: {
    label: "Công cộng",
    color: "bg-green-100 text-green-700 border border-green-300",
  },
};

export function getZoneTypeBadge(zoneType: ZoneType | string) {
  const config = zoneTypeDisplay[zoneType as ZoneType];
  if (!config) {
    return React.createElement(
      Badge,
      {
        variant: "outline",
        className: "bg-gray-100 text-gray-700",
      },
      String(zoneType)
    );
  }
  return React.createElement(
    Badge,
    {
      variant: "outline",
      className: config.color,
    },
    config.label
  );
}
