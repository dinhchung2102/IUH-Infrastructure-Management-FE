import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getZoneTypeBadge } from "../utils/zoneType.util";
import type { ZoneType } from "../api/area.api";

interface ZoneTypeHoverCardProps {
  zoneType: ZoneType | string;
  children?: React.ReactNode;
}

const zoneTypeDescriptions: Record<
  ZoneType,
  { title: string; description: string }
> = {
  FUNCTIONAL: {
    title: "Khu vực Chức năng",
    description:
      "Khu vực được sử dụng cho các hoạt động chức năng chính của cơ sở, như phòng học, phòng làm việc, phòng họp, thư viện, v.v.",
  },
  TECHNICAL: {
    title: "Khu vực Kỹ thuật",
    description:
      "Khu vực dành cho các thiết bị kỹ thuật, hệ thống cơ sở hạ tầng như phòng máy chủ, phòng điện, phòng nước, hệ thống điều hòa, v.v.",
  },
  SERVICE: {
    title: "Khu vực Dịch vụ",
    description:
      "Khu vực cung cấp các dịch vụ hỗ trợ như nhà vệ sinh, phòng y tế, căn tin, khu vực đỗ xe, v.v.",
  },
  PUBLIC: {
    title: "Khu vực Công cộng",
    description:
      "Khu vực mở cho công chúng sử dụng như sân vận động, công viên, khu vực giải trí, không gian công cộng, v.v.",
  },
};

export function ZoneTypeHoverCard({
  zoneType,
  children,
}: ZoneTypeHoverCardProps) {
  const description = zoneTypeDescriptions[zoneType as ZoneType];

  if (!description) {
    // Fallback nếu zoneType không hợp lệ
    return <>{children || getZoneTypeBadge(zoneType)}</>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer inline-block">
          {children || getZoneTypeBadge(zoneType)}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold leading-none">
              {description.title}
            </h4>
            <p className="text-sm text-muted-foreground">
              {description.description}
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

