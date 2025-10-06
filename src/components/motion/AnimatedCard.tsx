import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import * as React from "react";

export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof Card>
>(({ children, className, ...props }, ref) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card ref={ref} className={className} {...props}>
        {children}
      </Card>
    </motion.div>
  );
});

AnimatedCard.displayName = "AnimatedCard";
