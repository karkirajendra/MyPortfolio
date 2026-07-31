import { useState, useEffect } from "react";

export function useCounter(target, go, dur = 1400) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!go) return;
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setN(Math.round(e * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, go, dur]);

  return n;
}
