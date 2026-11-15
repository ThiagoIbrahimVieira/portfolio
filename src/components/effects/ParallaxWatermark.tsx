"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

interface ParallaxWatermarkProps {
  number: string;
  label?: string;
  position?: "right" | "left";
  speed?: number;
}

export function ParallaxWatermark({
  number,
  label,
  position = "right",
  speed = 40,
}: ParallaxWatermarkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-speed, speed]
  );

  const isRight = position === "right";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute top-4 sm:top-8 pointer-events-none select-none z-0 overflow-hidden max-w-full ${
        isRight ? "right-4 sm:right-10 text-right" : "left-4 sm:left-10 text-left"
      }`}
    >
      <motion.div style={{ y }} className="will-change-transform">
        <span className="font-display text-[clamp(4.5rem,14vw,11rem)] leading-[0.8] text-white/[0.035] tracking-tighter uppercase block">
          {number}
        </span>
        {label && (
          <span className="font-mono text-[9px] sm:text-xs text-[#fbbf24]/[0.14] tracking-[0.28em] uppercase block mt-1">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
