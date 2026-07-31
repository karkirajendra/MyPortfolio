import { useRef, useState, useEffect } from "react";
import { useCounter } from "../hooks/useCounter";
import { useTilt } from "../hooks/useTilt";

export default function About() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const c1 = useCounter(4, vis);
  const c2 = useCounter(50, vis);
  const c3 = useCounter(7, vis);
  const c4 = useCounter(2, vis);
  const { ref: tRef1, onMove: tm1, onLeave: tl1 } = useTilt(8);
  const { ref: tRef2, onMove: tm2, onLeave: tl2 } = useTilt(8);
  const { ref: tRef3, onMove: tm3, onLeave: tl3 } = useTilt(8);
  const { ref: tRef4, onMove: tm4, onLeave: tl4 } = useTilt(8);
  const tilts = [[tRef1, tm1, tl1], [tRef2, tm2, tl2], [tRef3, tm3, tl3], [tRef4, tm4, tl4]];

  return (
    <section id="about" className="sec" ref={ref}>
      <div className="rv"><p className="eye">who I am</p><h2 className="stl">About Me</h2></div>
      <div className="abgr rv" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
        <div>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "1.1rem" }}>I'm a <strong style={{ color: "var(--txt)", fontWeight: 700 }}>motivated BCA student</strong> in my 7th semester at Tribhuvan University — with a passion for building web apps that people actually use.</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "1.1rem" }}>Deep experience with <strong style={{ color: "var(--cyan)" }}>MERN stack</strong>, <strong style={{ color: "var(--emerald)" }}>Laravel</strong>, and <strong style={{ color: "var(--violet)" }}>Vue.js</strong> — shipped multiple production-ready projects from rental platforms to booking systems.</p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "var(--muted)", marginBottom: "1.5rem" }}>I thrive at the intersection of clean code and intuitive design, constantly leveling up my craft.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["★ MERN Stack Training — N9-Solution", "★ Git & GitHub Basics"].map(c => (
              <span key={c} className="pl" style={{ color: "var(--gold)", borderColor: "rgba(251,191,36,0.25)", background: "rgba(251,191,36,0.06)" }}>{c}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="abst" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[[c1 + "+", "Projects Shipped", "Full-stack production apps."], [c2 + "+", "API Endpoints", "Designed & documented."], [c3 + "th", "Semester", "Tribhuvan University, BCA."], [c4 + "+", "Years Coding", "Building and shipping daily."]].map(([v, l, d], i) => {
              const [tr, tm, tl] = tilts[i];
              return (
                <div key={l} ref={tr} className="cd tilt-card" style={{ padding: "1.2rem 1.1rem" }} onMouseMove={tm} onMouseLeave={tl}>
                  <div className="tilt-shine" />
                  <div className="cnum">{v}</div>
                  <div style={{ fontFamily: "var(--fd)", fontWeight: 600, color: "var(--txt)", fontSize: "0.85rem", marginTop: "0.35rem" }}>{l}</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", color: "var(--dim)", marginTop: "0.2rem", lineHeight: 1.5 }}>{d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
