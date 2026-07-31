import { useState, useEffect } from "react";

export function useScrollProg() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const fn = () => {
      const d = document.documentElement;
      setP(Math.min(1, window.scrollY / Math.max(1, d.scrollHeight - d.clientHeight)));
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return p;
}
