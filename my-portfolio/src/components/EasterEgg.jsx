import { useState, useEffect } from "react";

export default function EasterEgg({ onClose }) {
  const [exiting, setExiting] = useState(false);
  const close = () => { setExiting(true); setTimeout(onClose, 350); };
  useEffect(() => { const t = setTimeout(close, 8000); return () => clearTimeout(t); }, []);

  const chars = "RAJENDRA KARKI".split("");
  return (
    <div className="konami-ovl" onClick={close}>
      <div className="konami-bg" />
      <div className={`konami-box${exiting ? " konami-exit" : ""}`}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎮</div>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.2rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {chars.map((c, i) => (
            <span key={i} style={{
              fontFamily: "var(--fp)", fontSize: "1.4rem", fontWeight: 800,
              background: "linear-gradient(135deg, var(--cyan), var(--violet))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              animation: `fadeUp 0.4s ${i * 0.05}s ease both`,
              display: "inline-block",
            }}>{c === " " ? "\u00A0" : c}</span>
          ))}
        </div>
        <p style={{ fontFamily: "var(--fm)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--emerald)", marginBottom: "0.5rem" }}>
          ↑↑↓↓←→←→ B A — You found the easter egg!
        </p>
        <p style={{ fontFamily: "var(--fd)", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.6, marginTop: "1rem" }}>
          If you're detail-oriented enough to type the Konami code, we'd probably work well together. 🤝
        </p>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {["MERN", "Laravel", "Vue", "Builder", "Problem Solver"].map(t => (
            <span key={t} className="pl" style={{ color: "var(--cyan)", borderColor: "rgba(34,211,238,0.3)", background: "rgba(34,211,238,0.06)" }}>{t}</span>
          ))}
        </div>
        <p style={{ fontFamily: "var(--fm)", fontSize: "0.52rem", color: "var(--dim)", marginTop: "1.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Click anywhere to close
        </p>
      </div>
    </div>
  );
}
