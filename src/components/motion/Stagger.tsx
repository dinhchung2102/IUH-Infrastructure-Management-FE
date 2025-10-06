import { motion, useReducedMotion } from "framer-motion";
import * as React from "react";

interface StaggerProps {
  children: React.ReactNode;
  interval?: number; // seconds
}

export function Stagger({ children, interval = 0.15 }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;

  const items = React.Children.toArray(children);
  return (
    <>
      {items.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{
            duration: 0.55,
            delay: index * interval,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {child}
        </motion.div>
      ))}
    </>
  );
}
