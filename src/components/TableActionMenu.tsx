import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

export interface TableAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
  separator?: "before" | "after" | "both";
  disabled?: boolean;
  customContent?: React.ReactNode; // For conditional rendering like status toggle
}

interface TableActionMenuProps {
  actions: TableAction[];
  showLabel?: boolean;
  align?: "start" | "center" | "end";
  triggerClassName?: string;
  triggerSize?: "default" | "sm" | "lg" | "icon";
}

export function TableActionMenu({
  actions,
  showLabel = false,
  align = "end",
  triggerClassName,
  triggerSize = "icon",
}: TableActionMenuProps) {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={triggerSize}
          className={triggerClassName || "h-8 w-8 p-0"}
        >
          <span className="sr-only">Mở menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {showLabel && (
          <>
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {actions.map((action, index) => {
          // Chỉ thêm separator nếu được chỉ định rõ ràng
          const hasSeparatorBefore =
            action.separator === "before" || action.separator === "both";
          const hasSeparatorAfter =
            action.separator === "after" || action.separator === "both";

          return (
            <React.Fragment key={index}>
              {hasSeparatorBefore && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
                className={
                  action.variant === "destructive"
                    ? "text-destructive focus:text-destructive cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {action.customContent ? (
                  action.customContent
                ) : (
                  <>
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </>
                )}
              </DropdownMenuItem>
              {hasSeparatorAfter && index < actions.length - 1 && (
                <DropdownMenuSeparator />
              )}
            </React.Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
