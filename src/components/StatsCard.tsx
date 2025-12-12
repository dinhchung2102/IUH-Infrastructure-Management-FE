import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
  isLoading?: boolean;
}

const variantStyles = {
  default: "bg-white text-slate-700 border-slate-200",
  success: "bg-white text-slate-700 border-slate-200",
  warning: "bg-white text-slate-700 border-slate-200",
  danger: "bg-white text-slate-700 border-slate-200",
  info: "bg-white text-slate-700 border-slate-200",
};

const iconVariantStyles = {
  default: "bg-slate-100 text-slate-600",
  success: "bg-emerald-100 text-emerald-600",
  warning: "bg-amber-100 text-amber-600",
  danger: "bg-rose-100 text-rose-600",
  info: "bg-blue-100 text-blue-600",
};

/**
 * Reusable StatsCard component for displaying statistics
 * Features counting animation when loading or value changes
 *
 * @example
 * <StatsCard
 *   title="Total Users"
 *   value={1234}
 *   icon={Users}
 *   description="Total registered users"
 *   variant="default"
 *   isLoading={false}
 * />
 */
export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  variant = "default",
  className,
  isLoading = false,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const prevLoadingRef = useRef<boolean>(isLoading);
  const prevValueRef = useRef<number | string>(value);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing intervals or animations
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (isLoading) {
      // When loading, reset to 0 and count up rapidly (1, 2, 3, 4...)
      setDisplayValue(0);
      
      intervalRef.current = setInterval(() => {
        setDisplayValue((prev) => prev + Math.floor(Math.random() * 5) + 1);
      }, 100); // Update every 100ms for smooth animation

      prevLoadingRef.current = true;
    } else if (typeof value === "number") {
      // When data is loaded, animate to target value
      const targetValue = value;
      const wasLoading = prevLoadingRef.current;
      const valueChanged = prevValueRef.current !== value;

      // If we just finished loading or value changed, animate to target
      if (wasLoading) {
        // Just finished loading - reset to 0 then animate to target
        setDisplayValue(0);
        prevLoadingRef.current = false;
        prevValueRef.current = value;
        
        // Use setTimeout to ensure reset happens before animation starts
        setTimeout(() => {
          animateValue(0, targetValue);
        }, 50);
      } else if (valueChanged) {
        // Value changed - animate from current display value
        const startValue = displayValue;
        prevValueRef.current = value;
        animateValue(startValue, targetValue);
      }
    } else {
      // String values - no animation
      prevLoadingRef.current = false;
      prevValueRef.current = value;
    }

    function animateValue(start: number, end: number) {
      const duration = 1000; // 1 second
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out-quart)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(start + (end - start) * easeOutQuart);
        
        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(end);
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLoading, value]);

  // Handle string values
  const displayText =
    typeof value === "number" ? displayValue.toLocaleString() : value;

  return (
    <Card className={cn("border", variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", iconVariantStyles[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{displayText}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 text-xs">
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground ml-1">
              so với tháng trước
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
