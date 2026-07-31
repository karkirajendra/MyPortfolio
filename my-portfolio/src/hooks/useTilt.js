import { useRef, useCallback } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useTilt(strength = 12) {
  const ref = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const onMove = useCallback((e) => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `perspective(900px) rotateX(${-dy * strength}deg) rotateY(${dx * strength}deg) scale(1.02)`;
    const shine = el.querySelector(".tilt-shine");
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${50 + dx * 30}% ${50 + dy * 30}%, rgba(255,255,255,0.07), transparent 60%)`;
      shine.style.opacity = "1";
    }
  }, [strength, reducedMotion]);

  const onLeave = useCallback(() => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
    const shine = el.querySelector(".tilt-shine");
    if (shine) shine.style.opacity = "0";
  }, [reducedMotion]);

  return { ref, onMove, onLeave };
}
