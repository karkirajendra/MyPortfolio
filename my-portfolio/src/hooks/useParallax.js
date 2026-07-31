import { useRef, useCallback, useEffect } from "react";

export function useParallax() {
  const scrollY = useRef(0);
  const rafRef = useRef(null);
  const listenersRef = useRef([]);

  const register = useCallback((el, speed) => {
    if (!el) return;
    listenersRef.current.push({ el, speed });
  }, []);

  useEffect(() => {
    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    const tick = () => {
      listenersRef.current.forEach(({ el, speed }) => {
        el.style.transform = `translateY(${scrollY.current * speed}px)`;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return register;
}
