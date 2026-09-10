import { addRipple } from "../utils/ripple";
import MagBtn from "./MagBtn";

export default function ProjectModal({ p, onClose }) {
  return (
    <div className="ovl" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="mdl">
        <div style={{ height: 3, background: `linear-gradient(90deg,${p.ca},${p.cb})`, margin: "-2rem -2rem 1.4rem", borderRadius: "2px 2px 0 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.1rem" }}>
          <div>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--dim)" }}>Case Study</p>
            <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.7rem", fontWeight: 800, color: "var(--txt)", marginTop: "0.25rem", letterSpacing: "-0.02em" }}>{p.title}</h3>
            <p style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: p.ca, marginTop: "0.15rem" }}>{p.subtitle}</p>
          </div>
          <MagBtn onClick={onClose} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--bdr)", borderRadius: 7, padding: "0.38rem 0.75rem", color: "var(--muted)", fontFamily: "var(--fm)", fontSize: "0.6rem" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--bdr2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; }}>✕ close</MagBtn>
        </div>
        {p.image && (
          <div style={{ height: 220, borderRadius: 12, overflow: "hidden", marginBottom: "1.3rem", border: "1px solid var(--bdr)", position: "relative" }}>
            <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <p style={{ fontSize: "0.88rem", lineHeight: 1.72, color: "var(--muted)", marginBottom: "1.3rem" }}>{p.desc}</p>
        <div className="mdig" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem", marginBottom: "1.2rem" }}>
          {[["Problem", p.story?.problem], ["Solution", p.story?.solution]].map(([l, c]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 11, padding: "1rem", border: "1px solid var(--bdr)" }}>
              <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dim)", marginBottom: "0.5rem" }}>{l}</p>
              <p style={{ fontSize: "0.83rem", lineHeight: 1.65, color: "var(--muted)" }}>{c}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.025)", borderRadius: 11, padding: "1.1rem", border: "1px solid var(--bdr)", marginBottom: "1.2rem" }}>
          <p style={{ fontFamily: "var(--fm)", fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--dim)", marginBottom: "0.7rem" }}>Highlights</p>
          <div className="mdhg" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {(p.story?.highlights ?? []).map(h => (
              <div key={h} style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem" }}>
                <span className="td" style={{ marginTop: 3, flexShrink: 0 }} /><span style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5 }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.38rem", marginBottom: "1.3rem" }}>
          {p.tech.map(t => <span key={t} className="pl" style={{ color: p.ca, borderColor: `${p.ca}35`, background: `${p.ca}0d`, fontSize: "0.58rem" }}>{t}</span>)}
        </div>
        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap", alignItems: "center" }}>
          {p.github && (
            <MagBtn href={p.github} target="_blank" rel="noreferrer" className="rbtn" onClickCapture={addRipple}
              style={{ background: `linear-gradient(135deg,${p.ca},${p.cb})`, color: "#000", fontFamily: "var(--fm)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, padding: "0.65rem 1.3rem", borderRadius: "8px", textDecoration: "none", boxShadow: `0 0 18px ${p.ca}40` }}>
              View on GitHub ↗
            </MagBtn>
          )}
          {p.demo && (
            <MagBtn href={p.demo} target="_blank" rel="noreferrer" className="rbtn" onClickCapture={addRipple}
              style={{ color: "var(--txt)", fontFamily: "var(--fm)", fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, padding: "0.65rem 1.3rem", borderRadius: "8px", textDecoration: "none", border: "1px solid var(--bdr2)" }}>
              Live Demo ↗
            </MagBtn>
          )}
          <span style={{ fontFamily: "var(--fm)", fontSize: "0.56rem", color: "var(--dim)" }}>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
