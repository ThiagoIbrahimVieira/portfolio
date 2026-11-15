"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 bg-[#fbbf24] origin-left z-50 shadow-[0_0_10px_rgba(251,191,36,0.5)] pointer-events-none"
      style={{ scaleX }}
    />
  );
}
