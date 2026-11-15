"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-900/60 pointer-events-none">
      <motion.div
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 origin-left shadow-[0_0_12px_rgba(251,191,36,0.8)]"
        style={{ scaleX }}
      />
    </div>
  );
}
