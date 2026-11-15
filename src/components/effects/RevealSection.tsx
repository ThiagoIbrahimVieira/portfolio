"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

export type AnimationVariant =
  | "blur-fade"
  | "stamp-pop"
  | "card-expand"
  | "fade-up-soft"
  | "fade-up"
  | "fade-down"
  | "slide-left"
  | "slide-right"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "scale-up"
  | "clip-reveal"
  | "mask-reveal"
  | "pop";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: AnimationVariant;
  once?: boolean;
  stagger?: number;
  childSelector?: string;
}

export function RevealSection({
  children,
  className = "",
  delay = 0,
  duration = 0.85,
  variant = "fade-up",
  stagger,
  childSelector,
}: RevealSectionProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === "undefined") return;

    // Acessibilidade: se o usuário prefere redução de movimento, visibilidade instantânea
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, clearProps: "all" });
      return;
    }

    const targets = childSelector ? el.querySelectorAll(childSelector) : el;
    if (!targets || (targets instanceof NodeList && targets.length === 0)) return;

    const isMobile = window.innerWidth < 768;

    let fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: isMobile ? Math.min(duration, 0.65) : duration,
      delay: delay,
      ease: "power3.out",
      clearProps: "all",
    };

    if (stagger && (targets instanceof NodeList || Array.isArray(targets))) {
      toVars.stagger = isMobile ? Math.min(stagger, 0.08) : stagger;
    }

    switch (variant) {
      case "blur-fade":
        fromVars = { opacity: 0, y: isMobile ? 18 : 36 };
        toVars.y = 0;
        toVars.duration = isMobile ? 0.65 : Math.max(0.85, duration);
        toVars.ease = "power4.out";
        break;
      case "fade-up":
        fromVars = { opacity: 0, y: isMobile ? 20 : 38 };
        toVars.y = 0;
        toVars.ease = "power3.out";
        break;
      case "fade-up-soft":
        fromVars = { opacity: 0, y: isMobile ? 12 : 22 };
        toVars.y = 0;
        toVars.ease = "power2.out";
        break;
      case "stamp-pop":
      case "pop":
        fromVars = { opacity: 0, scale: 0.86, rotate: isMobile ? -2 : -4 };
        toVars.scale = 1;
        toVars.rotate = 0;
        toVars.duration = isMobile ? 0.6 : Math.max(0.75, duration);
        toVars.ease = "back.out(1.8)";
        break;
      case "card-expand":
      case "scale-up":
        fromVars = { opacity: 0, scale: 0.94, y: isMobile ? 18 : 35 };
        toVars.scale = 1;
        toVars.y = 0;
        toVars.duration = isMobile ? 0.7 : Math.max(0.85, duration);
        toVars.ease = "power3.out";
        break;
      case "scale-in":
        fromVars = { opacity: 0, scale: 0.9 };
        toVars.scale = 1;
        toVars.ease = "power2.out";
        break;
      case "fade-down":
        fromVars = { opacity: 0, y: isMobile ? -16 : -32 };
        toVars.y = 0;
        toVars.ease = "power3.out";
        break;
      case "slide-left":
      case "fade-left":
        fromVars = { opacity: 0, x: isMobile ? -20 : -45 };
        toVars.x = 0;
        toVars.ease = "power3.out";
        break;
      case "slide-right":
      case "fade-right":
        fromVars = { opacity: 0, x: isMobile ? 20 : 45 };
        toVars.x = 0;
        toVars.ease = "power3.out";
        break;
      case "clip-reveal":
        fromVars = { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" };
        toVars.clipPath = "inset(0% 0% 0% 0%)";
        toVars.duration = isMobile ? 0.7 : Math.max(0.9, duration);
        toVars.ease = "power3.inOut";
        break;
      case "mask-reveal":
        fromVars = { opacity: 0, y: isMobile ? 22 : 50 };
        toVars.y = 0;
        toVars.duration = isMobile ? 0.7 : Math.max(0.9, duration);
        toVars.ease = "power4.out";
        break;
      default:
        fromVars = { opacity: 0, y: isMobile ? 16 : 32 };
        toVars.y = 0;
        toVars.ease = "power3.out";
    }

    let tween: gsap.core.Tween | null = null;

    const playReveal = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      tween = gsap.fromTo(targets, fromVars, toVars);
    };

    // Identifica se já está na viewport inicial (Hero e elementos de abertura)
    const rect = el.getBoundingClientRect();
    const isInInitialView = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;

    if (isInInitialView) {
      playReveal();
      return;
    }

    // Aplica o estado inicial de transição
    gsap.set(targets, fromVars);

    // IntersectionObserver nativo: hardware-accelerated, imune a descompassos de scroll e fontes
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            playReveal();
            observer.disconnect();
            break;
          }
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -4% 0px",
        threshold: 0.04,
      }
    );

    observer.observe(el);

    // Fail-safe timeout: garante 100% de visibilidade mesmo em capturas headless ou anomalias de iframe
    const safetyTimer = setTimeout(() => {
      if (!hasAnimatedRef.current) {
        playReveal();
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimer);
      if (tween) {
        tween.kill();
      }
    };
  }, [childSelector, delay, duration, stagger, variant]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
