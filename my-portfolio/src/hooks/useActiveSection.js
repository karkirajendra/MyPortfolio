import { useState, useEffect } from "react";

export function useActiveSection(ids) {
  const [act, setAct] = useState(ids[0] ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => {
        const v = es.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (v?.target?.id) setAct(v.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.2, 0.35] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);

  return act;
}
