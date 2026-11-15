"use client";

import { motion } from "framer-motion";
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
    hidden: { opacity: 0, y: 48, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -40, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -60, rotate: -1.5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 60, rotate: 1.5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.9, y: 24 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function RevealSection({
  children,
  className = "",
  delay = 0,
  duration = 0.65,
  variant = "fade-up",
  once = true,
}: RevealSectionProps) {
  const selectedVariant = VARIANTS[variant] || VARIANTS["fade-up"];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={selectedVariant}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
