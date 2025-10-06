import { motion, useScroll, useTransform } from "framer-motion";
import * as React from "react";

interface ParallaxProps {
  children: React.ReactNode;
  from?: number; // px
  to?: number; // px
}

export function Parallax({ children, from = -20, to = 20 }: ParallaxProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
}
