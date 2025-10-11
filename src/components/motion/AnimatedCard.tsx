import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import * as React from "react";

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  delay?: number;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, delay = 0, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3, ease: "easeOut" }}
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
  }
);

AnimatedCard.displayName = "AnimatedCard";
