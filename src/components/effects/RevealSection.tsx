"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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

  useEffect(() => {
    const el = elRef.current;
    if (!el || typeof window === "undefined") return;

    // Acessibilidade: prefers-reduced-motion ativa exibição limpa e instantânea
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, clearProps: "all" });
      return;
    }

    const isMobile = window.innerWidth < 768;

    let fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: isMobile ? Math.min(duration, 0.55) : duration,
      delay: isMobile ? Math.min(delay, 0.1) : delay,
      ease: "power3.out",
      clearProps: "all",
    };

    switch (variant) {
      case "fade-up":
        fromVars = { opacity: 0, y: isMobile ? 18 : 36 };
        toVars.y = 0;
        toVars.ease = "power3.out";
        break;
      case "fade-down":
        fromVars = { opacity: 0, y: isMobile ? -16 : -32 };
        toVars.y = 0;
        toVars.ease = "power3.out";
        break;
      case "slide-left":
      case "fade-left":
        fromVars = { opacity: 0, x: isMobile ? -22 : -42 };
        toVars.x = 0;
        toVars.ease = "power3.out";
        break;
      case "slide-right":
      case "fade-right":
        fromVars = { opacity: 0, x: isMobile ? 22 : 42 };
        toVars.x = 0;
        toVars.ease = "power3.out";
        break;
      case "scale-up":
        fromVars = { opacity: 0, scale: 0.94, y: isMobile ? 12 : 24 };
        toVars.scale = 1;
        toVars.y = 0;
        toVars.ease = "power3.out";
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
        toVars.ease = "power3.out";
    }

    // Elementos já visíveis no topo na primeira dobra disparam imediatamente
    const rect = el.getBoundingClientRect();
    const isInInitialView = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;

    if (isInInitialView) {
      gsap.fromTo(el, fromVars, {
        ...toVars,
        onComplete: () => {
          gsap.set(el, { clearProps: "all" });
        },
      });
      return;
    }

    // Estado inicial pré-scroll
    gsap.set(el, fromVars);

    // Integração com ScrollTrigger nativo
    const st = ScrollTrigger.create({
      trigger: el,
      start: isMobile ? "top 94%" : "top 86%",
      once,
      onEnter: () => {
        gsap.fromTo(el, fromVars, {
          ...toVars,
          onComplete: () => {
            gsap.set(el, { clearProps: "all" });
          },
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [delay, duration, once, variant]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}
