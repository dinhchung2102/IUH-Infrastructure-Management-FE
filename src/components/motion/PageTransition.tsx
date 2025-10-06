import { motion } from "framer-motion";
import * as React from "react";

interface PageTransitionProps extends React.ComponentProps<typeof motion.div> {
  durationMs?: number;
}

export function PageTransition({
  durationMs = 400,
  children,
  ...props
}: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -24, scale: 0.98 }}
      transition={{
        duration: durationMs / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
