"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type AnimationVariant = "fade-up" | "fade-down" | "slide-left" | "slide-right" | "scale-up" | "pop";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  once?: boolean;
}

const VARIANTS = {
  "fade-up": {
    hidden: { opacity: 0, y: 36, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -36, rotate: -1 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 36, rotate: 1 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.94, y: 16 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
};

const REDUCED_VARIANT = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function RevealSection({
  children,
  className = "",
  delay = 0,
  duration = 0.55,
  variant = "fade-up",
  once = true,
}: RevealSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const selectedVariant = shouldReduceMotion
    ? REDUCED_VARIANT
    : (VARIANTS[variant] || VARIANTS["fade-up"]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={selectedVariant}
      transition={{
        duration: shouldReduceMotion ? 0.15 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
