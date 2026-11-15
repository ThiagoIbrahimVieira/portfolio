"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Hook para observação de visibilidade no viewport e detecção de mobile.
 * Cumpre a diretriz de performance Street-Tech:
 * 1. Desativa elementos 3D/Three.js/Canvas pesados em telas < 768px.
 * 2. Pausa loops de renderização (requestAnimationFrame) quando o elemento está fora da tela via IntersectionObserver.
 */
export function usePerformanceVisibility(threshold = 0.1) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    const currentEl = containerRef.current;
    if (!currentEl) {
      return () => window.removeEventListener("resize", checkMobile);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold }
    );

    observer.observe(currentEl);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, [threshold]);

  return {
    containerRef,
    isVisible,
    isMobile,
    shouldRenderHeavy: isVisible && !isMobile,
    shouldRenderLight: isVisible,
  };
}
