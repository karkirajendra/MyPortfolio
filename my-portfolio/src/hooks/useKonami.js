import { useState, useEffect } from "react";

export function useKonami() {
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let pos = 0;
    const handler = (e) => {
      if (e.key === CODE[pos]) {
        pos++;
        if (pos === CODE.length) {
          setActivated(true);
          pos = 0;
        }
      } else {
        pos = e.key === CODE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return [activated, () => setActivated(false)];
}
