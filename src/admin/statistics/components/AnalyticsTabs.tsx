import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const AnalyticsTabs = TabsPrimitive.Root;

const AnalyticsTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center justify-start gap-1 rounded-none bg-transparent p-0",
      className
    )}
    {...props}
  />
));
AnalyticsTabsList.displayName = TabsPrimitive.List.displayName;

const AnalyticsTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-t-lg border-b-2 border-transparent bg-transparent px-6 py-2.5 text-sm font-semibold text-muted-foreground transition-all",
      "hover:bg-muted/50 hover:text-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none",
      className
    )}
    {...props}
  />
));
AnalyticsTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const AnalyticsTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
AnalyticsTabsContent.displayName = TabsPrimitive.Content.displayName;

export {
  AnalyticsTabs,
  AnalyticsTabsList,
  AnalyticsTabsTrigger,
  AnalyticsTabsContent,
};
