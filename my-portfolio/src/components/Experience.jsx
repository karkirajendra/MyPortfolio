import { experience } from "../data/experience";
import { useTilt } from "../hooks/useTilt";

function ExperienceCard({ item, i }) {
  const { ref, onMove, onLeave } = useTilt(5);
  return (
    <div key={item.role} ref={ref} className={`cd tilt-card rv ${i % 2 === 0 ? "fl" : "fr"}`} style={{ padding: "1.6rem", overflow: "hidden" }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="tilt-shine" />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${item.col},transparent)`, borderRadius: "2px 2px 0 0" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "30%", background: `radial-gradient(circle at top right,${item.col}08,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.8rem", marginBottom: "1rem" }}>
        <div>
          <span style={{ fontFamily: "var(--fm)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--dim)" }}>{item.when}</span>
          <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.25rem", fontWeight: 700, color: "var(--txt)", marginTop: "0.25rem" }}>{item.role}</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.1rem" }}>{item.org}</p>
        </div>
        <span className="pl" style={{ color: item.col, borderColor: `${item.col}35`, background: `${item.col}0d`, alignSelf: "flex-start", fontSize: "0.55rem" }}>{item.stack}</span>
      </div>
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {item.points.map(pt => (
          <li key={pt} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start", fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.6 }}>
            <span className="td" style={{ background: item.col, boxShadow: `0 0 8px ${item.col}` }} />{pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="sec">
      <div className="rv"><p className="eye">my journey</p><h2 className="stl">Experience</h2></div>
      <div className="expg rv" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {experience.map((item, i) => (
            <ExperienceCard key={item.role} item={item} i={i} />
          ))}
        </div>
        <div className="expa cd rv fr" style={{ padding: "1.6rem", alignSelf: "start" }}>
          <span style={{ fontFamily: "var(--fm)", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--cyan)" }}>Focus Areas</span>
          <h3 style={{ fontFamily: "var(--fp)", fontSize: "1.3rem", fontWeight: 700, color: "var(--txt)", margin: "0.5rem 0 1.1rem" }}>What I care about</h3>
          {[{ i: "◈", l: "Product UI", d: "Accessible, responsive, polished interfaces." }, { i: "◫", l: "APIs", d: "Pragmatic REST with auth & validation." }, { i: "⟳", l: "Delivery", d: "Fast iteration: Vite + Git + clean commits." }].map(f => (
            <div key={f.l} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "0.9rem", marginBottom: "0.6rem", border: "1px solid var(--bdr)", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,211,238,0.25)"; e.currentTarget.style.background = "rgba(34,211,238,0.04)"; e.currentTarget.style.transform = "translateX(4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--bdr)"; e.currentTarget.style.background = "rgba(255,255,255,0.025)"; e.currentTarget.style.transform = "translateX(0)"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span style={{ color: "var(--cyan)", fontSize: "0.85rem", transition: "transform 0.3s" }}
                  onMouseEnter={e => { e.target.style.transform = "rotate(15deg) scale(1.2)"; }}
                  onMouseLeave={e => { e.target.style.transform = "rotate(0) scale(1)"; }}>{f.i}</span>
                <span style={{ fontWeight: 600, color: "var(--txt)", fontSize: "0.88rem" }}>{f.l}</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
