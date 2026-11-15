"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

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

export function RevealSection({
  children,
  className = "",
  delay = 0,
  duration = 0.85,
  variant = "fade-up",
  once = true,
}: RevealSectionProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === "undefined") return;

    // Acessibilidade: se o usuário prefere redução de movimento, visibilidade instantânea
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });
      return;
    }

    let fromVars: gsap.TweenVars = { opacity: 0 };
    let toVars: gsap.TweenVars = {
      opacity: 1,
      duration: duration,
      delay: delay,
      ease: "power3.out",
      clearProps: "transform,opacity",
    };

    switch (variant) {
      case "blur-fade":
      case "fade-up":
        fromVars = { opacity: 0, y: 36 };
        toVars.y = 0;
        toVars.ease = "power3.out";
        break;
      case "stamp-pop":
      case "pop":
        fromVars = { opacity: 0, scale: 0.88, rotate: -3 };
        toVars.scale = 1;
        toVars.rotate = 0;
        toVars.ease = "back.out(1.5)";
        break;
      case "card-expand":
      case "scale-up":
        fromVars = { opacity: 0, scale: 0.92, y: 44 };
        toVars.scale = 1;
        toVars.y = 0;
        toVars.ease = "power3.out";
        break;
      case "fade-up-soft":
        fromVars = { opacity: 0, y: 40 };
        toVars.y = 0;
        toVars.ease = "power2.out";
        break;
      case "fade-down":
        fromVars = { opacity: 0, y: -36 };
        toVars.y = 0;
        toVars.ease = "power3.out";
        break;
      case "slide-left":
        fromVars = { opacity: 0, x: -44 };
        toVars.x = 0;
        toVars.ease = "power3.out";
        break;
      case "slide-right":
        fromVars = { opacity: 0, x: 44 };
        toVars.x = 0;
        toVars.ease = "power3.out";
        break;
      default:
        fromVars = { opacity: 0, y: 32 };
        toVars.y = 0;
        toVars.ease = "power3.out";
    }

    // Identifica se já está visível na viewport inicial (ex: seção Hero)
    const rect = el.getBoundingClientRect();
    const isAlreadyInView = rect.top < window.innerHeight * 0.9 && rect.bottom > 0;

    let tween: gsap.core.Tween;
    if (isAlreadyInView) {
      tween = gsap.fromTo(el, fromVars, toVars);
    } else {
      toVars.scrollTrigger = {
        trigger: el,
        start: "top 88%",
        once: once,
        toggleActions: once ? "play none none none" : "play none none reverse",
      };
      tween = gsap.fromTo(el, fromVars, toVars);
    }

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
      tween.kill();
    };
  }, [delay, duration, once, variant]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
}
