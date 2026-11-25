"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mq = window.matchMedia("(min-width: 768px)");
    let lenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;

    const destroyLenis = () => {
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };

    const initLenis = () => {
      if (!mq.matches || lenis) return;
      lenis = new Lenis({
        duration: 1.0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
      });

      (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      tickerCallback = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    };

    const handleChange = () => {
      if (mq.matches) initLenis();
      else destroyLenis();
    };

    handleChange();
    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
      destroyLenis();
    };
  }, []);

  return null;
}
