import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClearFiltersButtonProps {
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable Clear Filters Button Component
 * Consistent styling across all admin pages
 */
export function ClearFiltersButton({
  onClick,
  className,
  disabled = false,
}: ClearFiltersButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "cursor-pointer text-red-500  hover:text-red-600  hover:bg-red-50",
        className
      )}
    >
      <Trash2 className="h-4 w-4" />
      Xóa bộ lọc
    </Button>
  );
}
