import { useEffect, useRef } from "react";
import { useIsTouch } from "../hooks/useIsTouch";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function CustomCursor() {
  const isTouch = useIsTouch();
  const reducedMotion = usePrefersReducedMotion();
  const pos = useRef({ x: -999, y: -999 });
  const ring = useRef(null);
  const dot = useRef(null);
  const glow = useRef(null);
  const label = useRef(null);
  const state = useRef("default");
  const rafId = useRef(null);

  const disabled = isTouch || reducedMotion;

  useEffect(() => {
    if (disabled) return;

    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [disabled]);

  useEffect(() => {
    if (disabled) return;

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isProject = el?.closest("[data-cursor='project']");
      const isBtn = el?.closest("[data-cursor='btn']") || el?.closest("button") || el?.closest("a");
      const isLink = el?.closest("[data-cursor='link']");
      const newState = isProject ? "project" : isBtn ? "btn" : isLink ? "link" : "default";

      if (newState !== state.current) {
        state.current = newState;
        const r = ring.current;
        const d = dot.current;
        const g = glow.current;
        const lb = label.current;
        if (!r || !d || !g || !lb) return;
        if (newState === "project") {
          r.style.width = "70px";
          r.style.height = "70px";
          r.style.borderColor = "rgba(34,211,238,0.8)";
          d.style.transform = "translate(-50%,-50%) scale(0)";
          lb.textContent = "VIEW";
          lb.classList.add("vis");
        } else if (newState === "btn") {
          r.style.width = "48px";
          r.style.height = "48px";
          r.style.borderColor = "rgba(34,211,238,0.9)";
          d.style.transform = "translate(-50%,-50%) scale(0)";
          lb.classList.remove("vis");
        } else {
          r.style.width = "32px";
          r.style.height = "32px";
          r.style.borderColor = "rgba(34,211,238,0.6)";
          d.style.transform = "translate(-50%,-50%) scale(1)";
          lb.classList.remove("vis");
        }
      }
    };

    const tick = () => {
      const r = ring.current;
      const d = dot.current;
      const g = glow.current;
      const lb = label.current;
      if (r && d && g) {
        const { x, y } = pos.current;
        r.style.left = x + "px";
        r.style.top = y + "px";
        d.style.left = x + "px";
        d.style.top = y + "px";
        g.style.left = x + "px";
        g.style.top = y + "px";
        if (lb) {
          lb.style.left = (x + 24) + "px";
          lb.style.top = (y - 16) + "px";
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <div id="cur-glow" ref={glow} />
      <div id="cur-ring" ref={ring} />
      <div id="cur-dot" ref={dot} />
      <div id="cur-label" ref={label} />
    </>
  );
}
