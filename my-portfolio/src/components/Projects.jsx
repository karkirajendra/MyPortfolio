import { useState } from "react";
import { useTilt } from "../hooks/useTilt";
import { addRipple } from "../utils/ripple";
import MagBtn from "./MagBtn";

function FeatCard({ p, onOpen }) {
  const [hov, setHov] = useState(false);
  const [techAnim, setTechAnim] = useState(false);

  return (
    <div className="cd" data-cursor="project"
      onMouseEnter={() => { setHov(true); setTimeout(() => setTechAnim(true), 100); }}
      onMouseLeave={() => { setHov(false); setTechAnim(false); }}
      style={{ boxShadow: hov ? "0 24px 60px rgba(34,211,238,0.12), 0 0 0 1px rgba(34,211,238,0.12)" : "none", transition: "all 0.35s" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg,${p.ca},${p.cb})`, borderRadius: "2px 2px 0 0" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at top right,${p.ca}08,transparent 55%)`, pointerEvents: "none" }} />
      <div className="fgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div className="fdesc" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.9rem" }}>
            <span style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--dim)" }}>Featured · {p.num}</span>
            <span className="pl" style={{ color: p.ca, borderColor: `${p.ca}35`, background: `${p.ca}0d`, fontSize: "0.52rem" }}>{p.badge || "Featured"}</span>
          </div>
          <h3 style={{ fontFamily: "var(--fp)", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "var(--txt)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>{p.title}</h3>
          <p style={{ fontFamily: "var(--fm)", fontSize: "0.62rem", textTransform: "uppercase", letterSpacing: "0.1em", color: p.ca, margin: "0.4rem 0 1rem" }}>{p.subtitle}</p>
          <p style={{ fontSize: "0.88rem", lineHeight: 1.72, color: "var(--muted)", marginBottom: "1.2rem" }}>{p.desc}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem", marginBottom: "1.4rem" }}>
            {(p.tech || []).map((t, ti) => (
              <span key={t} className="pl"
                style={{ color: "var(--dim)", borderColor: "var(--bdr)", background: "rgba(255,255,255,0.025)", fontSize: "0.57rem", transition: `all 0.2s ${ti * 60}ms`, transform: techAnim ? "translateY(0)" : "translateY(4px)", opacity: techAnim ? 1 : 0.5 }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <MagBtn onClick={onOpen} className="rbtn" onClickCapture={addRipple} data-cursor="btn"
              style={{ background: `linear-gradient(135deg,${p.ca},${p.cb})`, color: "#000", fontFamily: "var(--fm)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, padding: "0.6rem 1.3rem", borderRadius: "8px", border: "none", boxShadow: `0 0 20px ${p.ca}40` }}>
              Case Study →
            </MagBtn>
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer"
                style={{ fontFamily: "var(--fm)", fontSize: "0.62rem", color: "var(--dim)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em", transition: "color 0.2s", display: "inline-flex", alignItems: "center" }}
                onMouseEnter={e => { e.target.style.color = "var(--txt)"; }}
                onMouseLeave={e => { e.target.style.color = "var(--dim)"; }}>
                GitHub ↗
              </a>
            )}
          </div>
        </div>
        <div className="fprv" style={{ borderLeft: "1px solid var(--bdr)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", background: "var(--surf2)", border: "1px solid var(--bdr)", height: 160, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {p.image && (
              <img src={p.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
            )}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${p.ca}12,${p.cb}10)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)", backgroundSize: "18px 18px" }} />
            <div style={{ position: "absolute", inset: 0, padding: "1.2rem", fontFamily: "var(--fm)", fontSize: "0.58rem", lineHeight: 1.7, opacity: hov ? 1 : 0, transition: "opacity 0.4s ease 0.1s" }}>
              {[
                { col: "#fb7185", text: "const auth = await jwt.verify(" },
                { col: "#22d3ee", text: "  token, process.env.SECRET" },
                { col: "#a78bfa", text: "); // 3 roles ✓" },
                { col: "#34d399", text: "await cloudinary.upload(img);" },
                { col: "#fbbf24", text: "// 50+ endpoints deployed" },
              ].map((ln, li) => (
                <div key={li} style={{ color: ln.col, opacity: hov ? 1 : 0, transform: hov ? "translateX(0)" : "translateX(-8px)", transition: `all 0.3s ${li * 70}ms ease` }}>{ln.text}</div>
              ))}
            </div>
            <div style={{ position: "relative", textAlign: "center", opacity: hov ? 0 : 1, transition: "opacity 0.3s ease" }}>
              <div style={{ fontFamily: "var(--fp)", fontSize: "2.4rem", fontWeight: 800, color: `${p.ca}28`, letterSpacing: "-0.04em" }}>{p.title}</div>
              <div style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", color: "var(--dim)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: "0.2rem" }}>Preview</div>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 11, padding: "1.1rem", border: "1px solid var(--bdr)" }}>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--dim)", marginBottom: "0.7rem" }}>Highlights</p>
            {(p.story?.highlights ?? []).slice(0, 3).map((h, hi) => (
              <div key={h} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", marginBottom: "0.45rem", transform: hov ? "translateX(0)" : "translateX(-4px)", opacity: hov ? 1 : 0.6, transition: `all 0.3s ${hi * 80}ms ease` }}>
                <span className="td" style={{ marginTop: 3, flexShrink: 0 }} /><span style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SmCard({ p, onOpen, i }) {
  const [hov, setHov] = useState(false);
  const { ref, onMove, onLeave: tLeave } = useTilt(8);

  const handleLeave = () => { setHov(false); tLeave(); };

  return (
    <div ref={ref} className={`cd tilt-card rv d${i + 1}`} data-cursor="project"
      onMouseEnter={() => setHov(true)} onMouseLeave={handleLeave} onMouseMove={onMove}
      style={{ display: "flex", flexDirection: "column", boxShadow: hov ? `0 14px 40px ${p.ca}22` : "none", transition: "box-shadow 0.3s" }}>
      <div className="tilt-shine" />
      <div style={{ height: 2, background: `linear-gradient(90deg,${p.ca},${p.cb})`, borderRadius: "2px 2px 0 0" }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at top left,${p.ca}06,transparent 50%)`, pointerEvents: "none" }} />
      <div style={{ padding: "1.4rem", display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.9rem" }}>
          <div>
            <span style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)" }}>{p.num}</span>
            <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.3rem", fontWeight: 700, color: "var(--txt)", marginTop: "0.15rem" }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: p.ca, marginTop: "0.12rem" }}>{p.subtitle}</p>
          </div>
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer"
              style={{ width: 30, height: 30, borderRadius: 7, border: "1px solid var(--bdr)", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)", textDecoration: "none", fontSize: "0.72rem", flexShrink: 0, transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--bdr2)"; e.currentTarget.style.color = "var(--txt)"; e.currentTarget.style.transform = "rotate(-10deg) scale(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.color = "var(--dim)"; e.currentTarget.style.transform = "rotate(0) scale(1)"; }}>↗</a>
          )}
        </div>
        {p.image && (
          <div style={{ height: 130, borderRadius: 8, overflow: "hidden", marginBottom: "0.9rem", border: "1px solid var(--bdr)", position: "relative" }}>
            <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <p style={{ fontSize: "0.83rem", lineHeight: 1.65, color: "var(--muted)", flex: 1 }}>{p.desc}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", margin: "0.9rem 0" }}>
          {p.tech.map(t => <span key={t} className="pl" style={{ color: "var(--dim)", borderColor: "var(--bdr)", background: "rgba(255,255,255,0.02)", fontSize: "0.55rem" }}>{t}</span>)}
        </div>
        <MagBtn onClick={onOpen}
          style={{ width: "100%", background: "rgba(255,255,255,0.025)", border: `1px solid ${hov ? `${p.ca}50` : "var(--bdr)"}`, borderRadius: 8, padding: "0.58rem", fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.12em", color: hov ? p.ca : "var(--muted)", transition: "all 0.2s", justifyContent: "center" }}>
          View Case Study →
        </MagBtn>
      </div>
    </div>
  );
}

export default function Projects({ onOpen, items }) {
  const projects = items?.length ? items : [];
  const feat = projects.find((p) => p.featured) || projects[0];
  const rest = projects.filter((p) => p !== feat);

  return (
    <section id="projects" className="sec">
      <div className="rv"><p className="eye">what I built</p><h2 className="stl">Projects</h2></div>
      {feat && <div className="rv" style={{ marginBottom: "1.5rem" }}><FeatCard p={feat} onOpen={() => onOpen(feat)} /></div>}
      <div className="pjgr rv" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.1rem" }}>
        {rest.map((p, i) => <SmCard key={p.num} p={p} onOpen={() => onOpen(p)} i={i} />)}
      </div>
    </section>
  );
}
