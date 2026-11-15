"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export type AnimationVariant =
  | "blur-fade"
  | "stamp-pop"
  | "card-expand"
  | "fade-up-soft"
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "pop";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  once?: boolean;
}

const VARIANTS = {
  // 1. Editorial Blur Fade (Títulos, Headlines e Textos Nobres)
  "blur-fade": {
    hidden: { opacity: 0, filter: "blur(6px)", y: 20 },
    visible: { opacity: 1, filter: "none", y: 0 },
  },

  // 2. Tátil Stamp Pop (Stickers, Badges, Fitas Adesivas e Selos)
  "stamp-pop": {
    hidden: { opacity: 0, scale: 0.88, rotate: -3 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  },

  // 3. Card Expand & Elevate (Cards de Projetos, Módulos do Arsenal e Princípios)
  "card-expand": {
    hidden: { opacity: 0, scale: 0.95, y: 32 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },

  // 4. Fade Up Suave e Amplo
  "fade-up-soft": {
    hidden: { opacity: 0, y: 40, scale: 0.99 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },

  // 5. Timeline Slides (Diário e Jornada)
  "slide-left": {
    hidden: { opacity: 0, x: -36 },
    visible: { opacity: 1, x: 0 },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 36 },
    visible: { opacity: 1, x: 0 },
  },

  // 6. Aliases de compatibilidade
  "fade-up": {
    hidden: { opacity: 0, y: 36, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  "scale-up": {
    hidden: { opacity: 0, scale: 0.95, y: 24 },
    visible: { opacity: 1, scale: 1, y: 0 },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.88, rotate: -2 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  },
};

const REDUCED_VARIANT = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

// Curva de desaceleração premium cúbica ultra-suave
const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export function RevealSection({
  children,
  className = "",
  delay = 0,
  duration = 0.9,
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
      viewport={{ once, margin: "-70px" }}
      variants={selectedVariant}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: PREMIUM_EASE,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
