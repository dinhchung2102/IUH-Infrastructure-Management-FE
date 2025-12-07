import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useRoles } from "@/hooks/use-roles";
import { converRoleToDisplay } from "@/utils/convertDisplay.util";
import type { RoleName } from "@/types/role.enum";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showLabel?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  includeAllOption?: boolean;
  allOptionLabel?: string;
  filterActiveOnly?: boolean;
}

export function RoleSelect({
  value,
  onValueChange,
  placeholder = "Chọn vai trò",
  label,
  showLabel = false,
  required = false,
  disabled = false,
  className,
  includeAllOption = false,
  allOptionLabel = "Tất cả vai trò",
  filterActiveOnly = true,
}: RoleSelectProps) {
  const { roles, loading } = useRoles();

  // Filter active roles if needed
  const displayRoles = filterActiveOnly
    ? roles.filter((role) => role.isActive)
    : roles;

  const selectContent = (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled || displayRoles.length === 0}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value="all" className="cursor-pointer">
            {allOptionLabel}
          </SelectItem>
        )}
        {displayRoles.map((role) => (
          <SelectItem
            key={role._id}
            value={role.roleName}
            className="cursor-pointer"
          >
            {converRoleToDisplay(role.roleName as RoleName)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (loading) {
    return (
      <div className="space-y-2">
        {showLabel && label && (
          <Label>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (showLabel) {
    return (
      <div className="space-y-2">
        {label && (
          <Label>
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {selectContent}
      </div>
    );
  }

  return selectContent;
}
