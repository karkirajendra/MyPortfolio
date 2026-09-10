import { useState, useEffect } from "react";

export function useTyped(words, speed = 80, pause = 1900) {
  const [d, setD] = useState("");
  const [wi, setWi] = useState(0);
  const [ci, setCi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    if (!words?.length) return;
    const w = words[wi] || "";
    const atE = !del && ci === w.length;
    const atS = del && ci === 0;
    const delay = atE ? pause : del ? speed / 2 : speed;
    const t = setTimeout(() => {
      if (atE) {
        setDel(true);
        return;
      }
      if (atS) {
        setDel(false);
        setWi((i) => (i + 1) % words.length);
        return;
      }
      const n = del ? ci - 1 : ci + 1;
      setD(w.slice(0, n));
      setCi(n);
    }, delay);
    return () => clearTimeout(t);
  }, [ci, del, pause, speed, wi, words]);

  return d;
}
