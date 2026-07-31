import { useEffect } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export function useReveal() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      document.querySelectorAll(".rv, .blur-reveal").forEach((el) => el.classList.add("on"));
      return;
    }

    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("on"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".rv, .blur-reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [reducedMotion]);
}
