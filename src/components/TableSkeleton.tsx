import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface ColumnConfig {
  type?: "text" | "avatar" | "badge" | "number";
  width?: string;
  align?: "left" | "center" | "right";
}

interface TableSkeletonProps {
  rows?: number;
  columns: ColumnConfig[];
}

/**
 * Reusable TableSkeleton component
 *
 * @example
 * <TableSkeleton
 *   rows={10}
 *   columns={[
 *     { type: "number", width: "w-8", align: "center" },
 *     { type: "avatar", width: "size-12" },
 *     { type: "text", width: "w-[200px]" },
 *     { type: "badge", width: "w-[100px]" },
 *   ]}
 * />
 */
export function TableSkeleton({ rows = 5, columns }: TableSkeletonProps) {
  const getSkeletonByType = (config: ColumnConfig) => {
    const { type = "text", width = "w-full" } = config;

    switch (type) {
      case "avatar":
        return <Skeleton className="size-12 rounded-full" />;
      case "badge":
        return <Skeleton className={`h-6 ${width}`} />;
      case "number":
        return <Skeleton className={`h-4 ${width}`} />;
      case "text":
      default:
        return <Skeleton className={`h-4 ${width}`} />;
    }
  };

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {columns.map((config, colIdx) => (
            <TableCell
              key={colIdx}
              className={
                config.align === "center"
                  ? "text-center"
                  : config.align === "right"
                  ? "text-right"
                  : ""
              }
            >
              <div
                className={
                  config.align === "center"
                    ? "flex justify-center"
                    : config.align === "right"
                    ? "flex justify-end"
                    : ""
                }
              >
                {getSkeletonByType(config)}
              </div>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
