"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type AnimationVariant =
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "fade-left"
  | "fade-right"
  | "scale-up"
  | "pop"
  | "clip-reveal"
  | "mask-reveal";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  once?: boolean;
}

export function RevealSection({
  children,
  className = "",
  delay = 0,
  duration = 0.75,
  variant = "fade-up",
  once = true,
}: RevealSectionProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = elRef.current;
    if (!el || typeof window === "undefined") return;

    // GSAP context guarantees full cleanup on React 19 StrictMode double-mount
    // Source: https://gsap.com/docs/v3/GSAP/gsap.context/
    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, clearProps: "all" });
        return;
      }

      const isMobile = window.innerWidth < 768;

      let fromVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration: isMobile ? Math.min(duration, 0.38) : duration,
        delay: isMobile ? Math.min(delay, 0.06) : delay,
        ease: "power3.out",
        clearProps: "all",
      };

      switch (variant) {
        case "fade-up":
          fromVars = { opacity: 0, y: isMobile ? 10 : 36 };
          toVars.y = 0;
          break;
        case "fade-down":
          fromVars = { opacity: 0, y: isMobile ? -10 : -32 };
          toVars.y = 0;
          break;
        case "slide-left":
        case "fade-left":
          fromVars = isMobile ? { opacity: 0, y: 10 } : { opacity: 0, x: -42 };
          if (isMobile) toVars.y = 0;
          else toVars.x = 0;
          break;
        case "slide-right":
        case "fade-right":
          fromVars = isMobile ? { opacity: 0, y: 10 } : { opacity: 0, x: 42 };
          if (isMobile) toVars.y = 0;
          else toVars.x = 0;
          break;
        case "scale-up":
          fromVars = { opacity: 0, scale: isMobile ? 0.98 : 0.94, y: isMobile ? 10 : 24 };
          toVars.scale = 1;
          toVars.y = 0;
          break;
        case "pop":
          fromVars = { opacity: 0, scale: 0.86 };
          toVars.scale = 1;
          toVars.ease = "back.out(1.8)";
          break;
        case "clip-reveal":
          fromVars = { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" };
          toVars.clipPath = "inset(0% 0% 0% 0%)";
          toVars.ease = "power3.inOut";
          break;
        case "mask-reveal":
          fromVars = { opacity: 0, y: isMobile ? 20 : 40 };
          toVars.y = 0;
          toVars.ease = "power4.out";
          break;
        default:
          fromVars = { opacity: 0, y: isMobile ? 16 : 32 };
          toVars.y = 0;
      }

      const rect = el.getBoundingClientRect();
      const triggerLimit = window.innerHeight * (isMobile ? 0.94 : 0.88);
      const isAlreadyPassed = rect.bottom <= 0;
      const isInInitialView = rect.top < triggerLimit && rect.bottom > 0;

      if (isAlreadyPassed) {
        gsap.set(el, { clearProps: "all" });
        return;
      }

      if (isInInitialView) {
        gsap.fromTo(el, fromVars, toVars);
        return;
      }

      gsap.set(el, fromVars);

      ScrollTrigger.create({
        trigger: el,
        start: isMobile ? "top 95%" : "top 88%",
        once,
        onEnter: () => {
          gsap.fromTo(el, fromVars, toVars);
        },
        onEnterBack: once
          ? undefined
          : () => {
              gsap.fromTo(el, fromVars, toVars);
            },
      });
    }, elRef);

    return () => ctx.revert();
  }, [delay, duration, once, variant]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
