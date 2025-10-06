import { motion, useScroll } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-primary origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
