"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Mola suave para o anel seguidor
  const springConfig = { damping: 24, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Apenas desktop com mouse (desativa em touch screens)
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    if (isTouch) return;

    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Detecta elementos interativos sob o cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, input, textarea, [role='button'], article, figure, .badge-sticker, canvas"
      );
      setIsHovered(!!interactive);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100000] overflow-hidden">
      {/* Ponto Central Preciso com Contraste Total (Nunca some) */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#fbbf24] border border-black/80 shadow-[0_0_8px_#fbbf24] pointer-events-none"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.7 : isHovered ? 1.25 : 1,
        }}
        transition={{ duration: 0.12 }}
      />

      {/* Anel Seguidor Fluido com Física de Mola */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-2 border-amber-400 pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 40 : 24,
          height: isHovered ? 40 : 24,
          backgroundColor: isHovered ? "rgba(251, 191, 36, 0.18)" : "rgba(251, 191, 36, 0)",
          borderColor: isHovered ? "#fbbf24" : "rgba(251, 191, 36, 0.7)",
          scale: isClicking ? 0.8 : 1,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
    </div>
  );
}
